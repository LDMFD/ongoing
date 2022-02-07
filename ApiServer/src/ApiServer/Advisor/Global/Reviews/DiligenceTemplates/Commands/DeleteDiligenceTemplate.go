package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteDiligenceTemplateRequestPath struct {
	DiligenceTemplateId int64 `binding:"required"`
}

func DeleteDiligenceTemplate(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteDiligenceTemplateRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var diligenceTemplate = Entities.DiligenceTemplate{Id: path.DiligenceTemplateId}
	if err := db.NewSelect().
		Model(&diligenceTemplate).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := db.NewDelete().
		Model(&diligenceTemplate).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
