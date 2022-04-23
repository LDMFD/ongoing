package RiskLevels

import (
	Commands "ongoing/ApiServer/Advisor/Global/RiskLevels/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateRiskLevel)
	r.PUT("/:RiskLevelId", Commands.UpdateRiskLevel)
	r.DELETE("/:RiskLevelId", Commands.DeleteRiskLevel)
}
