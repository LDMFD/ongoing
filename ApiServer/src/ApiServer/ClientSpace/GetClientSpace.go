package ClientSpace

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/Reviews"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetClientSpace(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	user := c.MustGet("USER").(*Entities.User)

	var client = Entities.Client{UserId: user.Id}
	if err := db.NewSelect().
		Model(&client).
		Relation("User").
		Where("user_id = ?", client.UserId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	clientContext := client.ToReport()
	reviews := Reviews.GetReviews(c, &client)

	c.JSON(200, gin.H{
		"ClientContext": clientContext,
		"Reviews": reviews,
	})
}
