package FactFinds

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"ongoing/Utils/UUID"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateFactFindRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdateFactFindRequestBody struct {
	File      *Entities.RequestFile
	Submitted string
}

func CreateFactFind(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path CreateFactFindRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFactFindRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		panic(err.Error())
	}

	var submitted time.Time
	if submitted, err = Date.FromCanonical(body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		panic(err.Error())
	}

	uid := UUID.GenerateUID(c)

	var factFind = Entities.FactFind{
		Uid:       uid,
		ClientId:  client.Id,
		Submitted: submitted,
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if body.File != nil {
		factFind.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	if _, err := tx.NewInsert().Model(&factFind).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if body.File != nil {
		if err := auth.CreateClientFile(client.Uid, session.Org.Uid, body.File.Uid); err != nil {
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
