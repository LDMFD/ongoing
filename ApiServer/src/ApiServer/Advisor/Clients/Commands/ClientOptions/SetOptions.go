package ClientOptions

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
)

type SetOptionsRequestPath struct {
	ClientId string `binding:"required"`
}

type SetOptionsRequestBody struct {
	Options *string
}

func SetOptions(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

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

	if body.Options == nil {
		if _, err := db.NewDelete().Model((*Entities.ClientOptions)(nil)).
			Where("client_id = ?", client.Id).
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
	} else {
		options := &Entities.ClientOptions{
			ClientId: client.Id,
			Options:  body.Options,
		}
		if _, err := db.NewInsert().Model(options).
			On("CONFLICT (client_id) DO UPDATE").
			Set("\"options\" = EXCLUDED.options").
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
	}

	c.Status(http.StatusOK)
}
