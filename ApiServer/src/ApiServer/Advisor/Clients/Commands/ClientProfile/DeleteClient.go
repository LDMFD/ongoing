package ClientProfile

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteClientRequestPath struct {
	ClientId int64 `binding:"required"`
}

func DeleteClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client = Entities.Client{Id: path.ClientId}
	if err := db.NewSelect().
		Model(&client).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if _, err := db.NewDelete().
		Model(&client).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
