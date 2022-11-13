package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteModulePresetRequestPath struct {
	ModulePresetId int64 `binding:"required"`
}

func DeleteModulePreset(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteModulePresetRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var modulePreset = Entities.ModulePreset{}

	if _, err := db.NewDelete().
		Model(&modulePreset).
		Where("id = ?", path.ModulePresetId).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
