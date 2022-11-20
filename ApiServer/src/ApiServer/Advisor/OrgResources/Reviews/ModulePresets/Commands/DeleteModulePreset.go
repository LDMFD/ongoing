package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

func DeleteModulePreset(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateOrDeleteModulePresetRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var modulePreset = Entities.ModulePreset{}

	if _, err := db.NewDelete().
		Model(&modulePreset).
		Where("module_type = ?", path.Type).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
