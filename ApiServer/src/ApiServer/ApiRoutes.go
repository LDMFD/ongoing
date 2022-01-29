package ApiServer

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor"
	"ongoing/ApiServer/ClientSpace"
	"ongoing/Entities"
)

func AddApiRoutes(r *gin.Engine) {
	addCommonRoutes(r)
	addAdvisorRoutes(r)
	addClientSpaceRoutes(r)
}

func addCommonRoutes(r *gin.Engine) {
	routes := r.Group("/common")
	routes.Use(AuthMiddleware(nil))
	routes.GET("/user", getUser)
}

func addAdvisorRoutes(r *gin.Engine) {
	routes := r.Group("/advisor")
	routes.Use(AuthMiddleware(&Entities.UserTypeAdvisor))
	Advisor.AddRoutes(routes)
}

func addClientSpaceRoutes(r *gin.Engine) {
	routes := r.Group("/client")
	routes.Use(AuthMiddleware(&Entities.UserTypeClient))
	ClientSpace.AddRoutes(routes)
}
