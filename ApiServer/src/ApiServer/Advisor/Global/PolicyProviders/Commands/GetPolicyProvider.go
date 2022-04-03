package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetPolicyProviderPath struct {
	PolicyProviderId string `binding:"required"`
}

func GetPolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetPolicyProviderPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyProvider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&policyProvider).
		Where("uid = ?", path.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"PolicyProvider": policyProvider,
	})
}
