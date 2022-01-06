package Commands

import (
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetPolicyProviders(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var policyProviders []Models.PolicyProvider
	if err := db.NewSelect().Model(&policyProviders).OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"PolicyProviders": policyProviders,
	})
}
