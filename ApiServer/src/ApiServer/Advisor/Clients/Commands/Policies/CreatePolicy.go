package Policies

import (
	"github.com/google/uuid"
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type CreatePolicyRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdatePolicyRequestBody struct {
	ExternalId           string  `binding:"required"`
	PlatformDiscount     float64 // `binding:"required"`  0 doesn't work??
	MonthlyContributions int64   `binding:"required"`
	StartValue           int64   `binding:"required"`
	EndValue             int64   `binding:"required"`
	PolicyTypeId         string  `binding:"required"`
	PolicyProviderId     string  `binding:"required"`
	Notes                string  `binding:"required"`
}

func CreatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
 			panic(err.Error())
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

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

	var policy = Entities.Policy{
		Uid:                  uid,
		ClientId:             client.Id,
		ExternalId:           body.ExternalId,
		PlatformDiscount:     body.PlatformDiscount,
		MonthlyContributions: body.MonthlyContributions,
		StartValue:           body.StartValue,
		EndValue:             body.EndValue,
		PolicyTypeId:         policyType.Id,
		PolicyProviderId:     provider.Id,
		Notes:                body.Notes,
	}
	if _, err := db.NewInsert().Model(&policy).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Policy": policy,
	})
}
