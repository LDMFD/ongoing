package FactFinds

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

type UpdateFactFindRequestPath struct {
	ClientId   string `binding:"required"`
	FactFindId string `binding:"required"`
}

func UpdateFactFind(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path UpdateFactFindRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFactFindRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var factFind = Entities.FactFind{}
	if err := db.NewSelect().
		Model(&factFind).
		Relation("FilePtr.File").
		Where("fact_find.uid = ?", path.FactFindId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if client, err := Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	} else if factFind.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Risk Assessment does not belong to client"})
		panic(err.Error())
	}

	var submitted time.Time
	var err error
	if submitted, err = Date.FromCanonical(body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		panic(err.Error())
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
	if (body.File != nil && factFind.FilePtr != nil && body.File.Uid != factFind.FilePtr.File.Uid) || (body.File == nil && factFind.FilePtr != nil) {
		ctx := c.Request.Context()
		if err := auth.RemoveFileFromClientAndOrg(&ctx, &tx, path.ClientId, session.Org.Uid, factFind.FilePtr.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		toDelete = factFind.FilePtr
	}
	if body.File != nil {
		ctx := c.Request.Context()
		if err := auth.CreateClientFile(&ctx, &tx, path.ClientId, session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		factFind.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	factFind.Submitted = submitted

	if _, err := tx.NewUpdate().
		Model(&factFind).
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
