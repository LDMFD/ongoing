package Superuser

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Superuser/Commands"
	"ongoing/ApiServer/Superuser/Commands/DataManagement"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
	"ongoing/Database"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetAdminEntities)
	r.GET("/export", DataManagement.Export)
	r.POST("/import", DataManagement.Import)
	r.POST("/truncate", DataManagement.Truncate)
	r.GET("/stats", GetStats)
	AddOrganisationRoutes(r.Group("/organisations"))
}

func AddOrganisationRoutes(r *gin.RouterGroup) {
	r.POST("", Organisation.CreateOrganisation)
	r.PUT("/:OrgId", Organisation.UpdateOrganisation)
	r.DELETE("/:OrgId", Organisation.DeleteOrganisation)
}

func GetStats(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	app := Database.AppDbRows(db)
	auth := Database.AuthDbRows()
	txs := Database.OpenTransactions(db)

	c.JSON(200, gin.H{
		"Total": Database.RowCount(db),
		"App":   app,
		"Auth":  auth,
		"Txs":   txs,
	})
}
