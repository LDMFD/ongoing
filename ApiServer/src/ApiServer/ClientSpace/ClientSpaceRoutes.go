package ClientSpace

import (
	"github.com/gin-gonic/gin"
	StorageCommands "ongoing/ApiServer/Advisor/Storage/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", GetClientSpace)
	r.GET("/files", StorageCommands.RequestDownload)
}
