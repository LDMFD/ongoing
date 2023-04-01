package OrgResourceDeletion

import (
	"fmt"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

func DeleteFund(context *ServiceContext.Context, tx *bun.Tx, fundId string, execute bool) (ok bool) {
	response := &context.Response
	c := context.Response.FrameworkContext

	var fund = Entities.Fund{}
	if err := tx.NewSelect().
		Model(&fund).
		Relation("FilePtr.File").
		Relation("PolicyFunds.Client.User").
		Where("fund.uid = ?", fundId).
		Where("fund.org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	if len(fund.PolicyFunds) > 0 {
		for _, p := range fund.PolicyFunds {
			name := fmt.Sprintf("%v, %v", p.Client.User.Forenames, p.Client.User.Surname)
			response.AddResource(name)
		}
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, f := range fund.PolicyFunds {
		ClientDeletion.DeletePolicyFund(c, tx, f)
	}

	if fund.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromOrg(&ctx, tx, context.Session.Org.Uid, fund.FilePtr.File.Uid); err != nil {
			response.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *fund.FilePtr)
	}

	if _, err := tx.NewDelete().Model(&fund).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}

	return true
}
