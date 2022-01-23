package Models

import (
	"ongoing/ApiServer/Models/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetModels)
	r.POST("", Commands.CreateModel)
	r.PUT("/:ModelId", Commands.UpdateModel)
	r.DELETE("/:ModelId", Commands.DeleteModel)
}
