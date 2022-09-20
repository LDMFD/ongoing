package Storage

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Storage/Commands"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/files", Commands.RequestDownload)
	r.POST("/files", Commands.RequestUpload)
	r.POST("/signal", Commands.SignalUpload)
}
