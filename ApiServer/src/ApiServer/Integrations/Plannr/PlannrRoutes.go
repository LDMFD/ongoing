package Plannr

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Integrations/Plannr/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/authz-url", Commands.GetAuthorizationUrl)
	r.GET("/access-token", Commands.GetAccessToken)
	r.POST("/session", Commands.CreateSession)
	r.GET("/clients", Commands.GetClients)
}
