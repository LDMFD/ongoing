package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyProviderPath struct {
	PolicyProviderId string `binding:"required"`
}

func UpdatePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyProviderPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var req CreateOrUpdatePolicyProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyProvider = Entities.PolicyProvider{
		Name:          req.Name,
		Pricing:       req.Pricing,
		CustomPricing: req.CustomPricing,
	}
	if _, err := db.NewUpdate().Model(&policyProvider).Where("uid = ?", path.PolicyProviderId).
		Column("name").
		Column("pricing").
		Column("custom_pricing").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyProvider": policyProvider,
	})
}
