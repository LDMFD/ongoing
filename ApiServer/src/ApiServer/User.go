package ApiServer

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

func getUserInfo(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	res := Entities.ClientSessionContext{
		UserId: session.UserUid,
		Email:  session.Email,
		OrgId:  session.OrgId,
		Role:   session.Role,
	}

	var client = Entities.Client{}
	if exists, err := db.NewSelect().
		Model(&client).
		Relation("User").
		Where("user_id = ?", session.UserId).
		Exists(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} else if exists {
		if err := db.NewSelect().
			Model(&client).
			Relation("User").
			Where("user_id = ?", session.UserId).
			Scan(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
		res.ClientId = client.Uid
	}

	c.JSON(200, gin.H{
		"Context": res,
	})
}
