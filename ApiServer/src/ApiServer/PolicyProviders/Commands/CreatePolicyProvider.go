package Commands

import (
	"net/http"
	"ongoing/Models"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreatePolicyProviderRequest struct {
	Name string `binding:"required"`
	Pricing string `binding:"required"`
}

func CreatePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var req CreatePolicyProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyProvider = Models.PolicyProvider{
		Name: req.Name,
		Pricing: req.Pricing,
	}
	if _, err := db.NewInsert().Model(&policyProvider).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"PolicyProvider": policyProvider,
	})
}
