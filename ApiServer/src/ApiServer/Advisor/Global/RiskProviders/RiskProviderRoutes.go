package RiskProviders

import (
	Commands "ongoing/ApiServer/Advisor/Global/RiskProviders/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateRiskProvider)
	r.GET("/:RiskProviderId", Commands.GetRiskProvider)
	r.PUT("/:RiskProviderId", Commands.UpdateRiskProvider)
	r.DELETE("/:RiskProviderId", Commands.DeleteRiskProvider)
}
