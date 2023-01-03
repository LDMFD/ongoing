package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetModulePresets(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	modulePresets := GetModulePresetsInternal(c, db, *session.OrgId)

	c.JSON(200, gin.H{
		"ModulePresets": modulePresets,
	})
}

func GetModulePresetsInternal(c *gin.Context, db *bun.DB, orgId string) []Entities.ModulePreset {
	var modulePresets []Entities.ModulePreset
	if err := db.NewSelect().
		Model(&modulePresets).
		OrderExpr("module_type ASC").
		Relation("Org").
		Where("Org.Uid = ?", orgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	return modulePresets
}
