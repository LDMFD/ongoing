package ModulePresets

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/Reviews/ModulePresets/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetModulePresets)
	r.POST("", Commands.CreateModulePreset)
	r.PUT("/:ModulePresetId", Commands.UpdateModulePreset)
	r.DELETE("/:ModulePresetId", Commands.DeleteModulePreset)
}
