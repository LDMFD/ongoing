package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetPolicyProviderQuery struct {
	PolicyProviderId int64 `binding:"required"`
}

func GetPolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri GetPolicyProviderQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyProvider = Entities.PolicyProvider{Id: uri.PolicyProviderId}
	if err := db.NewSelect().
		Model(&policyProvider).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"PolicyProvider": policyProvider,
	})
}
