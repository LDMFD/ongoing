package PolicyGroups

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/PolicyGroups/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreatePolicyGroup)
	r.PUT("/:PolicyGroupId", Commands.UpdatePolicyGroup)
	r.DELETE("/:PolicyGroupId", Commands.DeletePolicyGroup)
}
