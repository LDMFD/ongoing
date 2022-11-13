package Reviews

import (
	"ongoing/ApiServer/Advisor/OrgResources/Reviews/ModulePresets"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	ModulePresets.AddRoutes(r.Group("/module-presets"))
}
