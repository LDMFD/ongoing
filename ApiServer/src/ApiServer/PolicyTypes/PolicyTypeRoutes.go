package PolicyTypes

import (
	"ongoing/ApiServer/PolicyTypes/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetPolicyTypes)
	r.POST("", Commands.CreatePolicyType)
	r.GET("/:PolicyTypeId", Commands.GetPolicyType)
	r.PUT("/:PolicyTypeId", Commands.UpdatePolicyType)
}
