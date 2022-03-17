package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetOperators(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var operators []Entities.Operator
	if err := db.NewSelect().
		Model(&operators).
		OrderExpr("name ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Operators": operators,
	})
}
