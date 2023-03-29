package OrgResourceDeletion

import (
	"fmt"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

func DeletePolicyType(context *ServiceContext.Context, tx *bun.Tx, policyTypeId string, execute bool) (ok bool) {
	response := &context.Response
	c := context.Response.FrameworkContext

	var policyType = Entities.PolicyType{}
	if err := tx.NewSelect().
		Model(&policyType).
		Relation("Policies.Client.User").
		Where("uid = ?", policyTypeId).
		Where("org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	for _, p := range policyType.Policies {
		s := fmt.Sprintf("Client: %v, %v", p.Client.User.Forenames, p.Client.User.Surname)
		response.AddResource(s)
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, pol := range policyType.Policies {
		ClientDeletion.DeletePolicy(context, tx, pol.Client.Uid, pol.Uid, execute)
	}

	if _, err := tx.NewDelete().Model(&policyType).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}

	return true
}
