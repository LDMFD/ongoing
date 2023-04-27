package OrgResourceDeletion

import (
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteAdvisor(context *ServiceContext.Context, tx *bun.Tx, advisorId string) bool {
	auth := context.Auth
	response := context.Response
	c := response.FrameworkContext
	ctx := c.Request.Context()

	var err error
	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, tx, advisorId); err != nil {
		context.Response.NotFound()
		return false
	}

	var orgId string
	if orgs, err := auth.LookupOrganisations(advisor.User.Uid); err != nil {
		response.NotFound()
		return false
	} else {
		orgId = orgs[0]
	}

	if err := auth.RemoveMember(&ctx, tx, orgId, advisor.User.Uid); err != nil {
		response.Panic(err)
	}

	var clientIds []string
	if clientIds, err = auth.GetClients(advisor.User.Uid); err != nil {
		response.Panic(err)
	} else {
		for _, clientId := range clientIds {
			if client, err := Helpers.ClientFromUID(c, tx, clientId); err != nil {
				response.Panic(err)
			} else {
				auth.DetachAdvisor(&ctx, tx, advisor.User.Uid, client.User.Uid)
			}
		}
	}

	if _, err := tx.NewDelete().
		Model(advisor).
		WherePK().
		Exec(c); err != nil {
		response.Panic(err)
	}

	var user Entities.User
	if _, err := tx.NewDelete().
		Model(&user).
		Where("id = ?", advisor.UserId).
		Exec(c); err != nil {
		response.Panic(err)
	}

	return true
}
