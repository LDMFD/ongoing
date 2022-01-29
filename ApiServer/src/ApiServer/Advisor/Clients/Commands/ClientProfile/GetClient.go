package ClientProfile

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetClientRequestPath struct {
	ClientId int64 `binding:"required"`
}

func GetClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Entities.Client{Id: path.ClientId}
	if err := db.NewSelect().
		Model(&client).
		Relation("Policies").
		Relation("PolicyFunds").
		Relation("Portfolios").
		Relation("Reviews").
		Relation("User").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}
