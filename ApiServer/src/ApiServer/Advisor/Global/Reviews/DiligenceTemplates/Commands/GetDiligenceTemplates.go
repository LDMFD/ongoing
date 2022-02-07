package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetDiligenceTemplates(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var diligenceTemplates []Entities.DiligenceTemplate
	if err := db.NewSelect().
		Model(&diligenceTemplates).
		OrderExpr("label ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"DiligenceTemplates": diligenceTemplates,
	})
}
