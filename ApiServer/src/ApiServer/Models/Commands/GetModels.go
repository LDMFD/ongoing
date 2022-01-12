package Commands

import (
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetModels(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var models []Entities.Model
	if err := db.NewSelect().
		Model(&models).
		Relation("File").
		OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Models": models,
	})
}
