package ClientProfile

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateClientRequestPath struct {
	ClientId int64 `binding:"required"`
}

type UpdateClientRequestBody struct {
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
	Email     string `binding:"required"`
}

func UpdateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body UpdateClientRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Entities.Client{
		Id:        path.ClientId,
		Forenames: body.Forenames,
		Surname:   body.Surname,
	}
	if _, err := db.NewUpdate().Model(&client).WherePK().
		Column("forenames").
		Column("surname").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.NewSelect().
		Model(&client).
		Relation("User").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.Email != client.User.Email {
		client.User.Email = body.Email
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
