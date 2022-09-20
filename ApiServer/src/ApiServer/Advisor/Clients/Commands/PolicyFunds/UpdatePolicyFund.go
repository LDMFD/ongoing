package PolicyFunds

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyFundRequestPath struct {
	ClientId     string `binding:"required"`
	PolicyFundId string `binding:"required"`
}

type CreateOrUpdatePolicyFundRequestBody struct {
	FundId     string  `binding:"required"`
	PolicyId   string  `binding:"required"`
	Proportion float64 `binding:"required"`
}

func UpdatePolicyFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyFund = Entities.PolicyFund{}
	if err := db.NewSelect().
		Model(&policyFund).
		Where("uid = ?", path.PolicyFundId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	if policyFund.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.PolicyFundDoesNotBelongToClient})
		return
	}

	var policy = Entities.Policy{}
	if err := db.NewSelect().
		Model(&policy).
		Where("uid = ?", body.PolicyId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var fund = Entities.Fund{}
	if err := db.NewSelect().
		Model(&fund).
		Where("uid = ?", body.FundId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	policyFund.FundId = fund.Id
	policyFund.PolicyId = policy.Id
	policyFund.Proportion = body.Proportion

	if _, err := db.NewUpdate().
		Model(&policyFund).
		WherePK().
		Column("fund_id").
		Column("policy_id").
		Column("proportion").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyFund": policyFund,
	})
}
