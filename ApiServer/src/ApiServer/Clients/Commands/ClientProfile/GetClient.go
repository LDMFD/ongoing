package ClientProfile

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetClientRequestPath struct {
	ClientId int64 `binding:"required"`
}

func GetClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{Id: path.ClientId}
	if err := db.NewSelect().
		Model(&client).
		Relation("Reviews").
		Relation("Policies").
		Relation("Holdings").
		//Relation("Holdings.Policy").
		//Relation("Holdings.Portfolio").
		//Relation("Reviews.Files").
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}
