package ApiServer

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor"
	"ongoing/ApiServer/Advisor/OrgAdmin"
	"ongoing/ApiServer/Advisor/Storage"
	"ongoing/ApiServer/Advisor/Storage/Commands"
	"ongoing/ApiServer/ClientSpace"
	"ongoing/ApiServer/Superuser"
	"ongoing/AuthService"
	"ongoing/Entities"
)

func AddApiRoutes(r *gin.Engine) {
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
}

func addStorageRoutes(r *gin.Engine) {
	routes := r.Group("/api/storage")
	routes.Use(AuthMiddleware(&[]string{
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

func healthcheck(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	// Test DB connection
	user := Entities.User{}
	if err := db.NewSelect().Model(&user).Limit(1).Scan(c); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "database connection"})
		return
	}

	// Test storage key generation (doesn't test upload)
	Commands.GenerateSignedGetUrl("test")

	// Test SpiceDB
	schema, err := auth.ReadSchema()
	if err != nil {
		log.Println(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "auth server down"})
		return
	}
	if schema == nil || len(*schema) == 0 {
		log.Println("no schema")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "auth server not initialized"})
		return
	}

	c.JSON(200, "pass")
}
