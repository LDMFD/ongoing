package PolicyTypes

import (
	Commands "ongoing/ApiServer/Advisor/Global/PolicyTypes/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreatePolicyType)
	r.PUT("/:PolicyTypeId", Commands.UpdatePolicyType)
	r.DELETE("/:PolicyTypeId", Commands.DeletePolicyType)
}
