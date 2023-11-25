package Commands

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteAdvisor(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	auth := context.Auth
	db := context.Db
	response := &context.Response

	var path UpdateOrDeleteAdvisorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var query Helpers.ExecuteQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		context.Response.InvalidInput()
		return
	}

	var err error
	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, path.AdvisorId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No such advisor exists."})
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer tx.Rollback()

	for _, client := range ClientProfile.GetClientsInternal(c, *context.Session.OrgId) {
		if client.AdvisorId == "" {
			continue
		}
		if advisor, err := Helpers.AdvisorFromUserUID(c, db, client.AdvisorId); err != nil {
			response.Panic(err)
		} else if advisor.User.Uid == path.AdvisorId {
			response.AddResource(client.Identity.Surname + ", " + client.Identity.Forenames)
		}
	}

	if !query.Execute {
		response.CheckIntegrity()
		return
	}

	var orgId string
	if orgs, err := auth.LookupOrganisations(advisor.User.Uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		orgId = orgs[0]
	}

	ctx := c.Request.Context()

	for _, client := range ClientProfile.GetClientsInternal(c, *context.Session.OrgId) {
		if err := auth.RemoveClientAdvisor(&ctx, &tx, client.Id, advisor.User.Uid); err != nil {
			response.Panic(err)
		}
	}

	if err := auth.RemoveMember(&ctx, &tx, orgId, advisor.User.Uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
	}

	if _, err := tx.NewDelete().
		Model(advisor).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var user Entities.User
	if _, err := tx.NewDelete().
		Model(&user).
		Where("id = ?", advisor.UserId).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
