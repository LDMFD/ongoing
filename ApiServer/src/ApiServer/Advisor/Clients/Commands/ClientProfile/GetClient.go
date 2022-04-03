package ClientProfile

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile/Reports"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetClientRequestPath struct {
	ClientId string `binding:"required"`
}

func GetClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client = Entities.Client{}
	if err := db.NewSelect().
		Model(&client).
		Relation("User").
		Where("uid = ?", path.ClientId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"ClientContext": client.ToReport(),
		"Report":        Reports.GenerateReport(c, client.Id),
		"Reviews":       Reports.GetReviews(c, &client),
	})
}
