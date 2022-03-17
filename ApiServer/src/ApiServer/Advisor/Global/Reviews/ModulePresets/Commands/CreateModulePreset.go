package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateModulePresetRequestBody struct {
	ModuleType  string  `binding:"required"`  // TODO enum
	Text        string  `binding:"required"`
}

func CreateModulePreset(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var body CreateOrUpdateModulePresetRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var modulePreset = Entities.ReviewModulePreset{
		ModuleType:  body.ModuleType,
		Text:        body.Text,
	}
	if _, err := db.NewInsert().Model(&modulePreset).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"ModulePreset": modulePreset,
	})
}
