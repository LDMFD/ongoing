package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateDiligenceTemplateRequestPath struct {
	DiligenceTemplateId int64 `binding:"required"`
}

func UpdateDiligenceTemplate(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateDiligenceTemplateRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdateDiligenceTemplateRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var diligenceTemplate = Entities.DiligenceTemplate{
		Id:          path.DiligenceTemplateId,
		Label:       body.Label,
		Text:        body.Text,
	}
	if _, err := db.NewUpdate().Model(&diligenceTemplate).WherePK().
		Column("label").
		Column("text").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"DiligenceTemplate": diligenceTemplate,
	})
}
