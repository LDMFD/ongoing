package PolicyFunds

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
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

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

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

	var policyFund = Entities.PolicyFund{
		Uid:        uid,
		ClientId:   client.Id,
		FundId:     fund.Id,
		PolicyId:   policy.Id,
		Proportion: body.Proportion,
	}
	if _, err := db.NewInsert().Model(&policyFund).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"PolicyFund": policyFund,
	})
}

