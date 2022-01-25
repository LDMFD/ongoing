package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetFunds(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var funds []Entities.Fund
	if err := db.NewSelect().
		Model(&funds).
		OrderExpr("name ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(200, gin.H{
		"Funds": funds,
	})
}
