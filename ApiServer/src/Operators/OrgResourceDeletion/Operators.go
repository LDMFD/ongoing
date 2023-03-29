package OrgResourceDeletion

import (
	"fmt"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteOperator(context *ServiceContext.Context, tx *bun.Tx, operatorId string, execute bool) (ok bool) {
	response := &context.Response
	c := context.Response.FrameworkContext

	var operator = Entities.Operator{}
	if err := tx.NewSelect().
		Model(&operator).
		Relation("Models").
		Relation("Models.Portfolios.Client.User").
		Where("uid = ?", operatorId).
		Where("operator.org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	if len(operator.Models) > 0 {
		for _, m := range operator.Models {
			for _, p := range m.Portfolios {
				name := fmt.Sprintf("Client: %v, %v", p.Client.User.Forenames, p.Client.User.Surname)
				response.AddResource(name)
			}
			response.AddResource("Model: " + m.Name)
		}
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, m := range operator.Models {
		DeleteModel(context, tx, m.Uid, true)
	}

	if _, err := tx.NewDelete().Model(&operator).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}

	return true
}
