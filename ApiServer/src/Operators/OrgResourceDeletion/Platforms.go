package OrgResourceDeletion

import (
	"fmt"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

func DeletePlatform(context *ServiceContext.Context, tx *bun.Tx, platformId string, execute bool) (ok bool) {
	response := &context.Response
	c := context.Response.FrameworkContext

	var policyProvider = Entities.PolicyProvider{}
	if err := tx.NewSelect().
		Model(&policyProvider).
		Relation("Policies.Client.User").
		Relation("Charges").
		Relation("Discounts.Client.User").
		Where("uid = ?", platformId).
		Where("org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	for _, p := range policyProvider.Policies {
		name := fmt.Sprintf("%v, %v", p.Client.User.Forenames, p.Client.User.Surname)
		response.AddResource(name)
	}
	for _, pd := range policyProvider.Discounts {
		name := fmt.Sprintf("%v, %v", pd.Client.User.Forenames, pd.Client.User.Surname)
		if !response.HasResource(name) {
			response.AddResource(name + " (discount only)")
		}
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, pol := range policyProvider.Policies {
		ClientDeletion.DeletePolicy(context, tx, pol.Client.Uid, pol.Uid, true)
	}
	for _, pc := range policyProvider.Charges {
		DeletePlatformCharge(context, tx, pc.Uid)
	}
	for _, pd := range policyProvider.Discounts {
		ClientDeletion.DeleteProviderDiscount(c, tx, pd)
	}

	if _, err := tx.NewDelete().Model(&policyProvider).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}

	return true
}

func DeletePlatformCharge(context *ServiceContext.Context, tx *bun.Tx, chargeId string) bool {
	response := &context.Response
	c := context.Response.FrameworkContext

	var providerCharge = Entities.ProviderCharge{}
	if err := tx.NewSelect().
		Model(&providerCharge).
		Relation("PolicyProvider").
		Where("provider_charge.uid = ?", chargeId).
		Where("policy_provider.org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	if _, err := tx.NewDelete().Model(&providerCharge).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}
	return true
}
