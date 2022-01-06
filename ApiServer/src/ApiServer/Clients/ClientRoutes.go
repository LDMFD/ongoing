package Clients

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Clients/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetClients)
	r.POST("", Commands.CreateClient)
	r.GET("/:ClientId", Commands.GetClient)
	r.PUT("/:ClientId", Commands.UpdateClient)

	r.POST("/:ClientId/reviews", Commands.CreateReview)
}
