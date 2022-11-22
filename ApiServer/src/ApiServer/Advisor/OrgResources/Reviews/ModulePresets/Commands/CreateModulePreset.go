package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
)

type CreateOrUpdateModulePresetRequestBody struct {
	ModuleType string `binding:"required"` // TODO enum
	Text       string `binding:"required"`
}

func CreateModulePreset(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateOrUpdateModulePresetRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err)
	}

	var modulePreset = Entities.ModulePreset{
		Uid:        UUID.GenerateUID(c),
		OrgId:      session.Org.Id,
		ModuleType: body.ModuleType,
		Text:       body.Text,
	}
	if _, err := db.NewInsert().Model(&modulePreset).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true" {
			return
		}
		panic(err)
	}

	c.JSON(200, gin.H{})
}
