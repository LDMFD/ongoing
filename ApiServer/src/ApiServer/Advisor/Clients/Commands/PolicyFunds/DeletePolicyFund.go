package PolicyFunds

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeletePolicyFundRequestPath struct {
	ClientId     string `binding:"required"`
	PolicyFundId string `binding:"required"`
}

func DeletePolicyFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
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
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	if policyFund.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy fund does not belong to client"})
		panic(err.Error())
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
