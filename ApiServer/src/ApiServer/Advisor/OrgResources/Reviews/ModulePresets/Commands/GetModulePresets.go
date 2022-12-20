package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetModulePresets(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	modulePresets := GetModulePresetsInternal(c, db)

	c.JSON(200, gin.H{
		"ModulePresets": modulePresets,
	})
}

func GetModulePresetsInternal(c *gin.Context, db *bun.DB) []Entities.ModulePreset {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var modulePresets []Entities.ModulePreset
	if err := db.NewSelect().
		Model(&modulePresets).
		OrderExpr("module_type ASC").
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	return modulePresets
}
