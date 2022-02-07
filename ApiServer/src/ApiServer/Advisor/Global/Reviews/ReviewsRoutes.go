package Reviews

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Global/Reviews/DiligenceTemplates"
	"ongoing/ApiServer/Advisor/Global/Reviews/ModulePresets"
)

func AddRoutes(r *gin.RouterGroup) {
	DiligenceTemplates.AddRoutes(r.Group("/diligence-templates"))
	ModulePresets.AddRoutes(r.Group("/module-presets"))
}
