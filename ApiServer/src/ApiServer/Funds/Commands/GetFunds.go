package Commands

import (
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
		panic(err)
	}
	
	c.JSON(200, gin.H{
		"Funds": funds,
	})
}
