package PolicyFunds

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

type DeletePolicyFundRequestPath struct {
	ClientId     string `binding:"required"`
	PolicyFundId string `binding:"required"`
}

func DeletePolicyFund(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeletePolicyFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var policyFund = Entities.PolicyFund{}
	if err := db.NewSelect().
		Model(&policyFund).
		Where("uid = ?", path.PolicyFundId).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			context.Response.Panic(err)
		}
		return
	}

	if policyFund.ClientId != client.Id {
		context.Response.NotFound()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	ClientDeletion.DeletePolicyFund(c, &tx, &policyFund)

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
