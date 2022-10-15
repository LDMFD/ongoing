package RiskProviders

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/RiskProviders/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateRiskProvider)
	r.PUT("/:RiskProviderId", Commands.UpdateRiskProvider)
	r.DELETE("/:RiskProviderId", Commands.DeleteRiskProvider)
}
