package ClientSpace

import (
	"database/sql"
	"fmt"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/Entities"

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

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered: ", r)
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}()

	dbClient, _ := ClientProfile.GetClientInternal(c, &client)
	metadata := dbClient.Metadata

	reviews := ClientProfile.GetReviews(c, &client)

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"Metadata": metadata,
		"Reviews":  reviews,
	})
}
