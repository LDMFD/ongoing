package OrgResourceDeletion

import (
	"fmt"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

func DeleteModel(context *ServiceContext.Context, tx *bun.Tx, modelId string, execute bool) (ok bool) {
	response := &context.Response
	c := context.Response.FrameworkContext

	var model = Entities.Model{}
	if err := context.Db.NewSelect().
		Model(&model).
		Relation("FilePtr.File").
		Relation("Portfolios.Client.User").
		Where("model.uid = ?", modelId).
		Where("model.org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		response.NotFound()
		return false
	}

	if len(model.Portfolios) > 0 {
		for _, p := range model.Portfolios {
			name := fmt.Sprintf("%v, %v", p.Client.User.Forenames, p.Client.User.Surname)
			response.AddResource(name)
		}
	}

	if !execute {
		response.CheckIntegrity()
		return false
	}

	// Dependencies
	for _, p := range model.Portfolios {
		ClientDeletion.DeletePortfolio(c, tx, p)
	}

	if _, err := tx.NewDelete().Model(&model).WherePK().Exec(c); err != nil {
		response.Panic(err)
	}

	if model.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromOrg(&ctx, tx, context.Session.Org.Uid, model.FilePtr.File.Uid); err != nil {
			context.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *model.FilePtr)
	}

	return true
}
