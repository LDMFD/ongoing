package ApiServer

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor"
	"ongoing/ApiServer/Advisor/Storage"
	"ongoing/ApiServer/Advisor/Storage/Commands"
	"ongoing/ApiServer/ClientSpace"
	"ongoing/Entities"
)

func AddApiRoutes(r *gin.Engine) {
	addCommonRoutes(r)
	addAdvisorRoutes(r)
	addClientSpaceRoutes(r)
}

func addCommonRoutes(r *gin.Engine) {
	r.GET("/api/healthcheck", healthcheck)

	routes := r.Group("/api/common")
	routes.Use(AuthMiddleware(nil))
	routes.GET("/user", getUser)

	// TODO add security for files
	Storage.AddRoutes(routes.Group("/storage"))
}

func addAdvisorRoutes(r *gin.Engine) {
	routes := r.Group("/api/advisor")
	routes.Use(AuthMiddleware(&Entities.UserTypeAdvisor))
	Advisor.AddRoutes(routes)
}

func addClientSpaceRoutes(r *gin.Engine) {
	routes := r.Group("/api/client-detail")
	routes.Use(AuthMiddleware(&Entities.UserTypeClient))
	ClientSpace.AddRoutes(routes)
}

func healthcheck(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	// Test DB connection
	user := Entities.User{}
	if err := db.NewSelect().Model(&user).Limit(1).Scan(c); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{ "error": "database connection" })
		return
	}

	// Test storage key generation (doesn't test upload)
	Commands.GenerateSignedGetUrl("test")

	c.JSON(200, "pass")
}
