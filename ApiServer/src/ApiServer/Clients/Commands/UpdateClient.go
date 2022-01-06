package Commands

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateClientQuery struct {
	ClientId int64 `binding:"required"`
}

type UpdateClientRequest struct {
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
}

func UpdateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri UpdateClientQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req UpdateClientRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{
		Id:        uri.ClientId,
		Forenames: req.Forenames,
		Surname:   req.Surname,
	}
	if _, err := db.NewUpdate().Model(&client).WherePK().
		Column("forenames").
		Column("surname").Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Client": client,
	})
}
