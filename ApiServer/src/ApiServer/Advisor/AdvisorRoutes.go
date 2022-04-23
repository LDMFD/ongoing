package Advisor

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Clients"
	"ongoing/ApiServer/Advisor/Global"
	"ongoing/ApiServer/Advisor/Global/Funds"
	"ongoing/ApiServer/Advisor/Global/Models"
	"ongoing/ApiServer/Advisor/Global/Operators"
	"ongoing/ApiServer/Advisor/Global/PolicyProviders"
	"ongoing/ApiServer/Advisor/Global/PolicyTypes"
	"ongoing/ApiServer/Advisor/Global/ProviderCharges"
	"ongoing/ApiServer/Advisor/Global/Reviews"
	"ongoing/ApiServer/Advisor/Global/RiskLevels"
	"ongoing/ApiServer/Advisor/Global/RiskProviders"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/global", Global.GetGlobalEntities)
	Clients.AddRoutes(r.Group("/clients"))
	Funds.AddRoutes(r.Group("/funds"))
	Operators.AddRoutes(r.Group("/operators"))
	Models.AddRoutes(r.Group("/models"))
	PolicyTypes.AddRoutes(r.Group("/policy-types"))
	PolicyProviders.AddRoutes(r.Group("/policy-providers"))
	ProviderCharges.AddRoutes(r.Group("/provider-charges"))
	RiskProviders.AddRoutes(r.Group("/risk-providers"))
	RiskLevels.AddRoutes(r.Group("/risk-levels"))
	Reviews.AddRoutes(r.Group("/reviews"))
}
