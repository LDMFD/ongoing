package Commands

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetClientQuery struct {
	ClientId int64 `binding:"required"`
}

func GetClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri GetClientQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{Id: uri.ClientId}
	if err := db.NewSelect().
		Model(&client).
		Relation("Reviews").
		//Relation("Reviews.Files").
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}
