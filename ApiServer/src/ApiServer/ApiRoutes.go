package ApiServer

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor"
	"ongoing/ApiServer/Advisor/OrgAdmin"
	"ongoing/ApiServer/Advisor/Storage"
	"ongoing/ApiServer/ClientSpace"
	"ongoing/ApiServer/Superuser"
	"ongoing/Entities"
)

func AddRoutes(r *gin.Engine) {
	addUnauthenticatedRoutes(r)
	addUserInfoRoute(r)
	addStorageRoutes(r)
	addSuperuserRoutes(r)
	addAdvisorRoutes(r)
	addOrgAdminRoutes(r)
	addClientSpaceRoutes(r)
}

func addUnauthenticatedRoutes(r *gin.Engine) {
	routes := r.Group("/api")

	routes.Use(AuthMiddleware(nil))
	routes.GET("/healthcheck", healthcheck)
	routes.GET("/errorcheck", errorcheck)
}

func addUserInfoRoute(r *gin.Engine) {
	routes := r.Group("/api/user")
	routes.Use(AuthMiddleware(&[]string{
		Entities.UserTypeSuperuser,
		Entities.UserTypeOrgOwner,
		Entities.UserTypeOrgAdmin,
		Entities.UserTypeAdvisor,
		Entities.UserTypeClient,
	}))
	routes.GET("/info", getUserInfo)
	routes.GET("/errorcheck", errorcheck)
}

func addStorageRoutes(r *gin.Engine) {
	routes := r.Group("/api/storage")
	routes.Use(AuthMiddleware(&[]string{
		Entities.UserTypeSuperuser,
		Entities.UserTypeOrgOwner,
		Entities.UserTypeOrgAdmin,
		Entities.UserTypeAdvisor,
		Entities.UserTypeClient,
	}))
	Storage.AddRoutes(routes.Group("/"))
}

func addSuperuserRoutes(r *gin.Engine) {
	routes := r.Group("/api/admin")
	routes.Use(AuthMiddleware(&[]string{
		Entities.UserTypeSuperuser,
	}))
	Superuser.AddRoutes(routes)
}

func addOrgAdminRoutes(r *gin.Engine) {
	adminRoutes := r.Group("/api/staff")
	adminRoutes.Use(AuthMiddleware(&[]string{
		Entities.UserTypeOrgOwner,
		Entities.UserTypeOrgAdmin,
	}))
	OrgAdmin.AddRoutes(adminRoutes)
}

func addAdvisorRoutes(r *gin.Engine) {
	routes := r.Group("/api/advisor")
	routes.Use(AuthMiddleware(&[]string{
		Entities.UserTypeOrgOwner,
		Entities.UserTypeOrgAdmin,
		Entities.UserTypeAdvisor,
	}))
	Advisor.AddRoutes(routes)
}

func addClientSpaceRoutes(r *gin.Engine) {
	routes := r.Group("/api/client-space")
	routes.Use(AuthMiddleware(&[]string{
		Entities.UserTypeClient,
	}))
	ClientSpace.AddRoutes(routes)
}
