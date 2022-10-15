package Models

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/Models/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateModel)
	r.PUT("/:ModelId", Commands.UpdateModel)
	r.DELETE("/:ModelId", Commands.DeleteModel)
}
