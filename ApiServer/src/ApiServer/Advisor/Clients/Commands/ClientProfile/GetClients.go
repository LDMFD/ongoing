package ClientProfile

import (
	"net/http"
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
	for _, c := range clients {
		rep := c.ToReport()

		if advisorId, err := context.Auth.GetAdvisor(c.Uid); err != nil {
			context.Panic(err)
		} else {
			rep.AdvisorId = advisorId
		}
		reportClients = append(reportClients, rep)
	}

	return reportClients
}
