package RiskAssessments

import (
	Commands "ongoing/ApiServer/Advisor/Global/Reviews/RiskAssessments/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetRiskAssessments)
	r.POST("", Commands.CreateRiskAssessment)
	r.PUT("/:RiskAssessmentId", Commands.UpdateRiskAssessment)
	r.DELETE("/:RiskAssessmentId", Commands.DeleteRiskAssessment)
}
