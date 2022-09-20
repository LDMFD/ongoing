package OrgAdmin

import (
	"github.com/gin-gonic/gin"

	"ongoing/ApiServer/Advisor/OrgAdmin/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetAdvisors)
	r.POST("", Commands.CreateAdvisor)
	r.PUT("/:AdvisorId", Commands.UpdateAdvisor)
}
