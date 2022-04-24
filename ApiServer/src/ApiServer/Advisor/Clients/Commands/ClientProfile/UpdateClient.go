package ClientProfile

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateClientRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdateClientRequestBody struct {
	Identity struct {
		Forenames string `binding:"required"`
		Surname   string `binding:"required"`
		Email     string `binding:"required"`
	} `binding:"required"`
	Fee float64 // allow 0 - `binding:"required"`
}

func UpdateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateClientRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)
	client.Forenames = body.Identity.Forenames
	client.Surname = body.Identity.Surname
	client.Fee = body.Fee

	if _, err := db.NewUpdate().Model(&client).WherePK().
		Column("forenames").
		Column("surname").
		Column("fee").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if err := db.NewSelect().
		Model(&client).
		Relation("User").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if body.Identity.Email != client.User.Email {
		client.User.Email = body.Identity.Email
		client.User.Verified = false
		if _, err := db.NewUpdate().Model(&client.User).WherePK().
			Column("email").
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(200, gin.H{
		"Client": client,
	})
}
