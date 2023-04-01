package ClientOptions

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

type SetOptionsRequestPath struct {
	ClientId string `binding:"required"`
}

type SetOptionsRequestBody struct {
	Options *string
}

func SetOptions(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path SetOptionsRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body SetOptionsRequestBody
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

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	if body.Options == nil {
		ClientDeletion.DeleteClientOptions(c, &tx, client)
	} else {
		options := &Entities.ClientOptions{
			ClientId: client.Id,
			Options:  body.Options,
		}
		if _, err := tx.NewInsert().Model(options).
			On("CONFLICT (client_id) DO UPDATE").
			Set("\"options\" = EXCLUDED.options").
			Exec(c); err != nil {
			context.Panic(err)
		}
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	c.Status(http.StatusOK)
}
