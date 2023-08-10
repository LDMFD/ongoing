package PolicyFunds

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
)

type CreatePolicyFundRequestPath struct {
	ClientId string `binding:"required"`
}

func CreatePolicyFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreatePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		panic(err.Error())
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

	uid := UUID.GenerateUID(c)

	var policyFund = Entities.PolicyFund{
		Uid:          uid,
		ClientId:     client.Id,
		FundId:       fund.Id,
		PolicyId:     policy.Id,
		Proportion:   body.Proportion,
		IncludeInFee: body.IncludeInFee,
	}
	if _, err := db.NewInsert().Model(&policyFund).Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}
	c.JSON(200, gin.H{
		"Id": uid,
	})
}
