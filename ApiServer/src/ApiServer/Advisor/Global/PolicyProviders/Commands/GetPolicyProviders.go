package Commands

import (
	"net/http"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyProviders": policyProviders,
	})
}
