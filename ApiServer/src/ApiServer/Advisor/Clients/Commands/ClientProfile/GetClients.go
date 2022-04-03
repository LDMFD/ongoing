package ClientProfile

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetClients(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var clients []Entities.Client
	if err := db.NewSelect().
		Model(&clients).
		Relation("User").
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
