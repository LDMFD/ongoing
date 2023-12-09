package Staff

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Staff/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetAdvisors)
	r.POST("", Commands.CreateAdvisor)
	r.PUT("/:AdvisorId", Commands.UpdateAdvisor)
	r.DELETE("/:AdvisorId", Commands.DeleteAdvisor)
}
