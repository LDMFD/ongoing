package Policies

import (
	"database/sql"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

type DeletePolicyRequestPath struct {
	ClientId string `binding:"required"`
	PolicyId string `binding:"required"`
}

type DeletePolicyQuery struct {
	Execute bool `form:"execute"`
}

func DeletePolicy(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	response := &context.Response

	var path DeletePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		response.InvalidInput()
		return
	}

	var query DeletePolicyQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.InvalidInput()
		return
	}

	var policy = Entities.Policy{}
	if err := context.Db.NewSelect().
		Model(&policy).
		Relation("Portfolios.Model.Operator").
		Relation("PolicyFunds.Fund").
		Relation("FilePtr.File").
		Where("policy.uid = ?", path.PolicyId).
		Scan(c); err != nil {
		response.NotFound()
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, context.Db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	if policy.ClientId != client.Id {
		response.AccessViolation()
		return
	}

	if len(policy.PolicyFunds) > 0 {
		for _, fund := range policy.PolicyFunds {
			response.AddResource("Fund " + fund.Fund.Name)
		}
	}

	if len(policy.Portfolios) > 0 {
		for _, p := range policy.Portfolios {
			response.AddResource("Portfolio " + p.Model.Operator.Name + " " + p.Model.Name)
		}
	}

	if !query.Execute {
		response.CheckIntegrity()
		return
	}

	for _, f := range policy.PolicyFunds {
		if _, err := context.Db.NewDelete().
			Model(f).
			WherePK().
			Exec(c); err != nil {
			response.Panic(err)
		}
	}

	for _, p := range policy.Portfolios {
		if _, err := context.Db.NewDelete().
			Model(p).
			WherePK().
			Exec(c); err != nil {
			response.Panic(err)
		}
	}

	tx, err := context.Db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		response.Panic(err)
	}

	if _, err := tx.NewDelete().
		Model(&policy).
		WherePK().
		Exec(c); err != nil {
		response.Panic(err)
	}

	if policy.FilePtr != nil {
		if err := context.Auth.RemoveFileFromClientAndOrg(path.ClientId, context.Session.Org.Uid, policy.FilePtr.File.Uid); err != nil {
			_ = tx.Rollback()
			response.Panic(err)
		}
		Helpers.DeleteFile(c, tx, *policy.FilePtr)
	}

	if err := tx.Commit(); err != nil {
		response.Panic(err)
	}

	response.ReturnOK()
}
