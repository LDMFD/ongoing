package ClientDeletion

import (
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeletePolicy(context *ServiceContext.Context, tx *bun.Tx, clientId, policyId string, execute bool) (ok bool) {
	response := &context.Response
	c := response.FrameworkContext

	var policy = Entities.Policy{}
	if err := tx.NewSelect().
		Model(&policy).
		Relation("Portfolios.Model.Operator").
		Relation("Portfolios.Model.Operator").
		Relation("PolicyFunds.Fund").
		Relation("FilePtr.File").
		Where("policy.uid = ?", policyId).
		Scan(c); err != nil {
		response.NotFound()
		panic(err)
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, context.Db, clientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			response.Panic(err)
		}
		return false
	}

	if policy.ClientId != client.Id {
		response.AccessViolation()
		return false
	}

	if len(policy.PolicyFunds) > 0 {
		for _, fund := range policy.PolicyFunds {
			response.AddResource("Policy fund " + fund.Fund.Name)
		}
	}

	if len(policy.Portfolios) > 0 {
		for _, p := range policy.Portfolios {
			response.AddResource("Portfolio " + p.Model.Operator.Name + " " + p.Model.Name)
		}
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, f := range policy.PolicyFunds {
		DeletePolicyFund(c, tx, f)
	}
	for _, p := range policy.Portfolios {
		DeletePortfolio(c, tx, p)
	}

	if _, err := tx.NewDelete().
		Model(&policy).
		WherePK().
		Exec(c); err != nil {
		response.Panic(err)
	}

	if policy.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromClientAndOrg(&ctx, tx, clientId, context.Session.Org.Uid, policy.FilePtr.File.Uid); err != nil {
			_ = tx.Rollback()
			response.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *policy.FilePtr)
	}

	return true
}
