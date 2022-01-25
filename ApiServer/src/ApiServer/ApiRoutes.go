package ApiServer

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor"
)

func AddApiRoutes(r *gin.Engine) {
	advisorRoutes := r.Group("/advisor")
	advisorRoutes.Use(AuthMiddleware())
	Advisor.AddRoutes(advisorRoutes)
}
