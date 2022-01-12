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

type UpdatePolicyRequestBody struct {
	ExternalId       string  `binding:"required"`
	PlatformDiscount float64 `binding:"required"`
	PolicyTypeId     int64   `binding:"required"`
	PolicyProviderId int64   `binding:"required"`
}

func UpdatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body UpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policy = Entities.Policy{Id: path.PolicyId}
	if err := db.NewSelect().
		Model(&policy).
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}

	if policy.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
	}

	policy.ExternalId = body.ExternalId
	policy.PlatformDiscount = body.PlatformDiscount
	policy.PolicyTypeId = body.PolicyTypeId
	policy.PolicyProviderId = body.PolicyProviderId

	if _, err := db.NewUpdate().
		Model(&policy).
		WherePK().
		Column("external_id").
		Column("platform_discount").
		Column("policy_type_id").
		Column("policy_provider_id").
		Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Policy": policy,
	})
}
