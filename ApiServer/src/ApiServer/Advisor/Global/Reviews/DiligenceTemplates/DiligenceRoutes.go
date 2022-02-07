package DiligenceTemplates

import (
	Commands "ongoing/ApiServer/Advisor/Global/Reviews/DiligenceTemplates/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetDiligenceTemplates)
	r.POST("", Commands.CreateDiligenceTemplate)
	r.PUT("/:DiligenceTemplateId", Commands.UpdateDiligenceTemplate)
	r.DELETE("/:DiligenceTemplateId", Commands.DeleteDiligenceTemplate)
}
