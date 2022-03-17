package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateModulePresetRequestPath struct {
	ModulePresetId int64 `binding:"required"`
}

func UpdateModulePreset(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateModulePresetRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateModulePresetRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var modulePreset = Entities.ReviewModulePreset{
		Id:          path.ModulePresetId,
		ModuleType:  body.ModuleType,
		Text:        body.Text,
	}
	if _, err := db.NewUpdate().Model(&modulePreset).WherePK().
		Column("module_type").
		Column("text").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"ModulePreset": modulePreset,
	})
}
