package ClientSpace

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetClientSpace(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var client = Entities.Client{UserId: session.UserId}
	if err := db.NewSelect().
		Model(&client).
		Relation("User").
		Where("user_id = ?", client.UserId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	clientContext := client.ToReport()
	reviews := ClientProfile.GetReviews(c, &client)

	c.JSON(200, gin.H{
		"Metadata": clientContext,
		"Reviews":  reviews,
	})
}
