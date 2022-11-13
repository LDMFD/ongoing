package ClientSpace

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

func GetClientSpace(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var client1 = Entities.Client{UserId: session.UserId}
	if err := db.NewSelect().
		Model(&client1).
		Relation("User").
		Where("user_id = ?", client1.UserId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client2 := ClientProfile.GetClientInternal(c, &client1)

	reviews := ClientProfile.GetReviews(c, &client1)

	c.JSON(200, gin.H{
		"Metadata": client2.Metadata,
		"Reviews":  reviews,
	})
}
