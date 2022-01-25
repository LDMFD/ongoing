package PolicyProviders

import (
	Commands "ongoing/ApiServer/Advisor/Global/PolicyProviders/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetPolicyProviders)
	r.POST("", Commands.CreatePolicyProvider)
	r.GET("/:PolicyProviderId", Commands.GetPolicyProvider)
	r.PUT("/:PolicyProviderId", Commands.UpdatePolicyProvider)
	r.DELETE("/:PolicyProviderId", Commands.DeletePolicyProvider)
}
