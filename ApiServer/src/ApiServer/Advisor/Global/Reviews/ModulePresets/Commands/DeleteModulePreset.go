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
		return
	}

	var modulePreset = Entities.ReviewModulePreset{Id: path.ModulePresetId}
	if err := db.NewSelect().
		Model(&modulePreset).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := db.NewDelete().
		Model(&modulePreset).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
