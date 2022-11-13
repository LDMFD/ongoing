package PolicyProviders

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/PolicyProviders/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreatePolicyProvider)
	r.PUT("/:PolicyProviderId", Commands.UpdatePolicyProvider)
	r.DELETE("/:PolicyProviderId", Commands.DeletePolicyProvider)
}
