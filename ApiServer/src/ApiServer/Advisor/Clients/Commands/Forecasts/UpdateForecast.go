package Forecasts

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"time"

	"github.com/gin-gonic/gin"
)

type UpdateForecastRequestPath struct {
	ClientId   string `binding:"required"`
	ForecastId string `binding:"required"`
}

func UpdateForecast(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path UpdateForecastRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateForecastRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var forecast = Entities.Forecast{}
	if err := db.NewSelect().
		Model(&forecast).
		Relation("FilePtr.File").
		Where("forecast.uid = ?", path.ForecastId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}
	if forecast.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Risk Assessment does not belong to client"})
		return
	}

	var submitted time.Time
	if submitted, err = Date.FromCanonical(body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer tx.Rollback()

	// FilePtr has been removed or changed; remove old relationship
	var toDelete *Entities.FilePtr
	if (body.File != nil && forecast.FilePtr != nil && body.File.Uid != forecast.FilePtr.File.Uid) || (body.File == nil && forecast.FilePtr != nil) {
		ctx := c.Request.Context()
		if err := auth.RemoveFileFromClientAndOrg(&ctx, &tx, path.ClientId, session.Org.Uid, forecast.FilePtr.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		toDelete = forecast.FilePtr
	}
	if body.File != nil {
		ctx := c.Request.Context()
		if err := auth.CreateClientFile(&ctx, &tx, path.ClientId, session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		forecast.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	forecast.Submitted = submitted

	if _, err := tx.NewUpdate().
		Model(&forecast).
		WherePK().
		Column("file_ptr_id").
		Column("submitted").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if toDelete != nil {
		Helpers.DeleteFile(c, tx, *toDelete)
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
