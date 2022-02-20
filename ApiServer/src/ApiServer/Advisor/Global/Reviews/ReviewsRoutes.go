package Reviews

import (
	"ongoing/ApiServer/Advisor/Global/Reviews/ModulePresets"
	"ongoing/ApiServer/Advisor/Global/Reviews/RiskAssessments"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	RiskAssessments.AddRoutes(r.Group("/risk-assessments"))
	ModulePresets.AddRoutes(r.Group("/module-presets"))
}
