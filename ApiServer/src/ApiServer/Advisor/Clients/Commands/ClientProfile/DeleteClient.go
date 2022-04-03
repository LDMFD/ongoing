package ClientProfile

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteClientRequestPath struct {
	ClientId string `binding:"required"`
}

func DeleteClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client = Entities.ClientFromUserUID(c, db, path.ClientId)

	if _, err := db.NewDelete().
		Model(&client).
		Where("id = ?", client.Id).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var user Entities.User
	if _, err := db.NewDelete().
		Model(&user).
		Where("id = ?", client.UserId).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
