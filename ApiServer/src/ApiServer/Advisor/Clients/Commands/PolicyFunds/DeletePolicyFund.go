package PolicyFunds

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeletePolicyFundRequestPath struct {
	ClientId     int64 `binding:"required"`
	PolicyFundId int64 `binding:"required"`
}

func DeletePolicyFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyFund = Entities.PolicyFund{Id: path.PolicyFundId}
	if err := db.NewSelect().
		Model(&policyFund).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if policyFund.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy fund does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&policyFund).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
