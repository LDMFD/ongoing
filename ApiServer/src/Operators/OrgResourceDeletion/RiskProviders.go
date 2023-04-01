package OrgResourceDeletion

import (
	"fmt"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

func DeleteRiskProvider(context *ServiceContext.Context, tx *bun.Tx, riskProviderId string, execute bool) (ok bool) {
	response := &context.Response
	c := context.Response.FrameworkContext

	var riskProvider = Entities.RiskProvider{}
	if err := tx.NewSelect().
		Model(&riskProvider).
		Relation("Levels.Assessments.Client.User").
		Where("uid = ?", riskProviderId).
		Where("org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	for _, p := range riskProvider.Levels {
		for _, a := range p.Assessments {
			s := fmt.Sprintf("%v, %v", a.Client.User.Forenames, a.Client.User.Surname)
			response.AddResource(s)
		}
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, level := range riskProvider.Levels {
		DeleteRiskLevel(context, tx, level.Uid, execute)
	}

	if _, err := tx.NewDelete().Model(&riskProvider).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}

	return true
}

func DeleteRiskLevel(context *ServiceContext.Context, tx *bun.Tx, id string, execute bool) bool {
	c := context.Response.FrameworkContext

	var level = Entities.RiskLevel{}
	if err := tx.NewSelect().
		Model(&level).
		Relation("RiskProvider").
		Relation("Assessments.Client.User").
		Where("risk_level.uid = ?", id).
		Where("risk_provider.org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		context.Response.NotFound()
		return false
	}

	for _, a := range level.Assessments {
		s := fmt.Sprintf("%v, %v", a.Client.User.Forenames, a.Client.User.Surname)
		context.Response.AddResource(s)
	}

	if !execute {
		context.Response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, assessment := range level.Assessments {
		ClientDeletion.DeleteRiskAssessment(c, tx, assessment.Client.Uid, assessment)
	}

	if _, err := tx.NewDelete().Model(&level).WherePK().Exec(c); err != nil {
		context.Response.Panic(err)
	}
	return true
}
