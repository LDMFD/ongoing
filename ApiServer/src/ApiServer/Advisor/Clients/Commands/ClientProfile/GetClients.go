package ClientProfile

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

func GetClients(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	c.JSON(200, gin.H{
		"Clients": GetClientsInternal(c, *context.Session.OrgId),
	})
}

func GetClientsInternal(c *gin.Context, orgId string) []Entities.ClientReport {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	var clients []Entities.Client
	if err := context.Db.NewSelect().
		Model(&clients).
		Relation("User").
		Relation("Organisation").
		Where("organisation.uid = ?", orgId).
		OrderExpr("id ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var reportClients = []Entities.ClientReport{}
	for _, client := range clients {
		rep := client.ToReport()

		var userAsAdvisor *Entities.Advisor
		var err error

		listAll := context.Session.Role == "superuser" ||
			context.Session.Role == "owner" ||
			context.Session.Role == "administrator"

		if !listAll {
			if userAsAdvisor, err = Helpers.AdvisorFromUserUID(c, context.Db, context.Session.UserUid); err != nil {
				context.Panic(err)
			}
		}

		if clientAdvisorId, err := context.Auth.GetAdvisor(client.Uid); err != nil {
			context.Panic(err)
		} else {
			if !listAll && (userAsAdvisor != nil && userAsAdvisor.User.Uid != clientAdvisorId) {
				continue
			}
			rep.AdvisorId = clientAdvisorId
		}
		reportClients = append(reportClients, rep)
	}

	return reportClients
}
