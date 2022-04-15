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
	Reviews.AddRoutes(r.Group("/reviews"))
}
