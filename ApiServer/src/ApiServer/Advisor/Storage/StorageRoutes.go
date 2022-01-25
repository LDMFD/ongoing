package Storage

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Storage/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/download", Commands.RequestDownload)
	r.GET("/upload", Commands.RequestUpload)
	r.POST("/upload", Commands.SignalUpload)
}
