package ClientSpace

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", ClientProfile.GetClient)
}
