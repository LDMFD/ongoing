package Commands

import (
	"net/http"
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
		OrderExpr("name ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Models": models,
	})
}
