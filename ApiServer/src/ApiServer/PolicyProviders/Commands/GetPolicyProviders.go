package Commands

import (
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetPolicyProviders(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var policyProviders []Entities.PolicyProvider
	if err := db.NewSelect().
		Model(&policyProviders).
		OrderExpr("name ASC").
		Scan(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"PolicyProviders": policyProviders,
	})
}
