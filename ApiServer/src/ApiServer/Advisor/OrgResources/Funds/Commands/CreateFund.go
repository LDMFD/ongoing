package Commands

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"ongoing/Utils/UUID"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type CreateOrUpdateFundRequestBody struct {
	Name      string  `binding:"required"`
	OcfFee    float64 `binding:"required"`
	ExAnteFee float64 `binding:"required"`
	Modified  string
	File      *Entities.RequestFile
}

func CreateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var fileId *int64
	if body.File != nil && body.File.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.File.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			panic(err.Error())
		}
		fileId = &file.Id
	}

	var modified time.Time
	var err error
	if body.Modified != "" {
		if modified, err = Date.FromCanonical(body.Modified); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'modified' timestamp"})
			panic(err.Error())
		}
	} else {
		modified = time.Now()
	}

	uid := UUID.GenerateUID(c)

	var fund = Entities.Fund{
		Uid:       uid,
		Name:      body.Name,
		OcfFee:    body.OcfFee,
		ExAnteFee: body.ExAnteFee,
		FileId:    fileId,
		Modified:  &modified,
		OrgId:     session.Org.Id,
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if _, err := tx.NewInsert().Model(&fund).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if body.File != nil {
		if err := auth.CreateOrgFile(session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{
		"Id": uid,
	})
}
