package Policies

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyRequestPath struct {
	ClientId int64 `binding:"required"`
	PolicyId int64 `binding:"required"`
}

func UpdatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policy = Entities.Policy{Id: path.PolicyId}
	if err := db.NewSelect().
		Model(&policy).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if policy.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
		return
	}

	policy.ExternalId = body.ExternalId
	policy.PlatformDiscount = body.PlatformDiscount
	policy.MonthlyContributions = body.MonthlyContributions
	policy.PolicyTypeId = body.PolicyTypeId
	policy.PolicyProviderId = body.PolicyProviderId

	if _, err := db.NewUpdate().
		Model(&policy).
		WherePK().
		Column("external_id").
		Column("platform_discount").
		Column("monthly_contributions").
		Column("policy_type_id").
		Column("policy_provider_id").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"Policy": policy,
	})
}
