package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateDiligenceTemplateRequestBody struct {
	Label string `binding:"required"`
	Text  string `binding:"required"`
}

func CreateDiligenceTemplate(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var body CreateOrUpdateDiligenceTemplateRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var diligenceTemplate = Entities.DiligenceTemplate{
		Label:   body.Label,
		Text:    body.Text,
	}
	if _, err := db.NewInsert().Model(&diligenceTemplate).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"DiligenceTemplate": diligenceTemplate,
	})
}
