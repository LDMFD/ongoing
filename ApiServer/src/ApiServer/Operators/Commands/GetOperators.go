package Commands

import (
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetOperators(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var operators []Models.Operator
	if err := db.NewSelect().Model(&operators).OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Operators": operators,
	})
}
