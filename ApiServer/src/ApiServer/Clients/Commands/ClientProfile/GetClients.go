package ClientProfile

import (
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetClients(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var clients []Models.Client
	if err := db.NewSelect().Model(&clients).OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Clients": clients,
	})
}
