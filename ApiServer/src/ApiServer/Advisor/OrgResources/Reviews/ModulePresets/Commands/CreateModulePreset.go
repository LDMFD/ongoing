package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"strings"
)

type CreateOrUpdateModulePresetRequestBody struct {
	ModuleType string `binding:"required"` // TODO enum
	Text       string `binding:"required"`
}

func CreateModulePreset(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateOrUpdateModulePresetRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err)
	}

	CreateModulePresetInternal(c, session.Org.Id, body)

	c.JSON(200, gin.H{})
}

func CreateModulePresetInternal(c *gin.Context, orgId int64, body CreateOrUpdateModulePresetRequestBody) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var modulePreset = Entities.ModulePreset{
		Uid:        UUID.GenerateUID(c),
		OrgId:      orgId,
		ModuleType: body.ModuleType,
		Text:       strings.TrimSpace(body.Text),
	}
	if _, err := db.NewInsert().Model(&modulePreset).Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}
}
