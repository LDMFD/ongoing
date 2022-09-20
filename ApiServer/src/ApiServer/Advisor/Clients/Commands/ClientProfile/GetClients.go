package ClientProfile

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetClients(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var clients []Entities.Client
	if err := db.NewSelect().
		Model(&clients).
		Relation("User").
		Relation("Organisation").
		Where("organisation.uid = ?", session.OrgId).
		OrderExpr("id ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var reportClients = []Entities.ClientReport{}
	for _, c := range clients {
		reportClients = append(reportClients, c.ToReport())
	}

	c.JSON(200, gin.H{
		"Clients": reportClients,
	})
}
