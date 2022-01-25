package Advisor

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Clients"
	"ongoing/ApiServer/Advisor/Global/Funds"
	"ongoing/ApiServer/Advisor/Global/Models"
	"ongoing/ApiServer/Advisor/Global/Operators"
	"ongoing/ApiServer/Advisor/Global/PolicyProviders"
	"ongoing/ApiServer/Advisor/Global/PolicyTypes"
	"ongoing/ApiServer/Advisor/Storage"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/user", getUser)

	Clients.AddRoutes(r.Group("/clients"))
	Funds.AddRoutes(r.Group("/funds"))
	Operators.AddRoutes(r.Group("/operators"))
	Models.AddRoutes(r.Group("/models"))
	PolicyTypes.AddRoutes(r.Group("/policy-types"))
	PolicyProviders.AddRoutes(r.Group("/policy-providers"))
	Storage.AddRoutes(r.Group("/storage"))
}
