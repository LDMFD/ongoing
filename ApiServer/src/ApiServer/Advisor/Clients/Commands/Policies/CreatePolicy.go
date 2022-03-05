package Policies

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type CreatePolicyRequestPath struct {
	ClientId int64 `binding:"required"`
}

type CreateOrUpdatePolicyRequestBody struct {
	ExternalId           string  `binding:"required"`
	PlatformDiscount     float64 // `binding:"required"`  0 doesn't work??
	MonthlyContributions int64   `binding:"required"`
	StartValue           int64   `binding:"required"`
	EndValue             int64   `binding:"required"`
	PolicyTypeId         int64   `binding:"required"`
	PolicyProviderId     int64   `binding:"required"`
}

func CreatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policy = Entities.Policy{
		ClientId:             path.ClientId,
		ExternalId:           body.ExternalId,
		PlatformDiscount:     body.PlatformDiscount,
		MonthlyContributions: body.MonthlyContributions,
		StartValue:           body.StartValue,
		EndValue:             body.EndValue,
		PolicyTypeId:         body.PolicyTypeId,
		PolicyProviderId:     body.PolicyProviderId,
	}
	if _, err := db.NewInsert().Model(&policy).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"Policy": policy,
	})
}
