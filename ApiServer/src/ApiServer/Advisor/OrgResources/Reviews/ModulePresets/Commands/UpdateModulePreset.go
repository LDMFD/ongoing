package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateOrDeleteModulePresetRequestPath struct {
	Type string `binding:"required"`
}

func UpdateModulePreset(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdateOrDeleteModulePresetRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateModulePresetRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var modulePreset = Entities.ModulePreset{
		ModuleType: body.ModuleType,
		Text:       strings.TrimSpace(body.Text),
	}
	if _, err := db.NewUpdate().
		Model(&modulePreset).
		Where("module_type = ?", path.Type).
		Where("org_id = ?", session.Org.Id).
		Column("module_type").
		Column("text").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
