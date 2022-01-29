package PolicyFunds

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyFundRequestPath struct {
	ClientId     int64 `binding:"required"`
	PolicyFundId int64 `binding:"required"`
}

type CreateOrUpdatePolicyFundRequestBody struct {
	FundId     int64   `binding:"required"`
	PolicyId   int64   `binding:"required"`
	Proportion float64 `binding:"required"`
}

func UpdatePolicyFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdatePolicyFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyFund = Entities.PolicyFund{Id: path.PolicyFundId}
	if err := db.NewSelect().
		Model(&policyFund).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if policyFund.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.PolicyFundDoesNotBelongToClient})
	}

	policyFund.FundId = body.FundId
	policyFund.PolicyId = body.PolicyId
	policyFund.Proportion = body.Proportion

	if _, err := db.NewUpdate().
		Model(&policyFund).
		WherePK().
		Column("fund_id").
		Column("policy_id").
		Column("proportion").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"PolicyFund": policyFund,
	})
}
