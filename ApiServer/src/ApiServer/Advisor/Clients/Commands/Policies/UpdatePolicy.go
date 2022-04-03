package Policies

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyRequestPath struct {
	ClientId string `binding:"required"`
	PolicyId string `binding:"required"`
}

func UpdatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policy = Entities.Policy{}
	if err := db.NewSelect().
		Model(&policy).
		Where("uid = ?", path.PolicyId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)
	if policy.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
		return
	}

	var policyType = Entities.PolicyType{}
	if err := db.NewSelect().
		Model(&policyType).
		Where("uid = ?", body.PolicyTypeId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	policy.ExternalId = body.ExternalId
	policy.PlatformDiscount = body.PlatformDiscount
	policy.MonthlyContributions = body.MonthlyContributions
	policy.StartValue = body.StartValue
	policy.EndValue = body.EndValue
	policy.PolicyTypeId = policyType.Id
	policy.PolicyProviderId = provider.Id
	policy.Notes = body.Notes

	if _, err := db.NewUpdate().
		Model(&policy).
		WherePK().
		Column("external_id").
		Column("platform_discount").
		Column("monthly_contributions").
		Column("start_value").
		Column("end_value").
		Column("policy_type_id").
		Column("policy_provider_id").
		Column("notes").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Policy": policy,
	})
}
