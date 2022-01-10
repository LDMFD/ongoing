package Commands

import (
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetPortfolios(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var portfolios []Models.Portfolio
	if err := db.NewSelect().
		Model(&portfolios).
		Relation("File").
		OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Portfolios": portfolios,
	})
}
