package PolicyFunds

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type CreatePolicyFundRequestPath struct {
	ClientId int64 `binding:"required"`
}

func CreatePolicyFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreatePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdatePolicyFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyFund = Entities.PolicyFund{
		ClientId:   path.ClientId,
		FundId:     body.FundId,
		PolicyId:   body.PolicyId,
		Proportion: body.Proportion,
	}
	if _, err := db.NewInsert().Model(&policyFund).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"PolicyFund": policyFund,
	})
}
