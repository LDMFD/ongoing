package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyProviderQuery struct {
	PolicyProviderId int64 `binding:"required"`
}

type UpdatePolicyProviderRequest struct {
	Name string `binding:"required"`
	Pricing string `binding:"required"`
}

func UpdatePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri UpdatePolicyProviderQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req UpdatePolicyProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyProvider = Entities.PolicyProvider{
		Id:   uri.PolicyProviderId,
		Name: req.Name,
		Pricing: req.Pricing,
	}
	if _, err := db.NewUpdate().Model(&policyProvider).WherePK().
		Column("name").
		Column("pricing").Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"PolicyProvider": policyProvider,
	})
}
