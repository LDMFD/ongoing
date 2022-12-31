package DataManagement

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Database"
	"os"
)

type TruncateRequestBody struct {
	Env string
}

func Truncate(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body TruncateRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if body.Env != os.Getenv("ONGOING_ENV") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Environment does not match"})
		return
	}

	Database.Truncate(db)

	Database.SeedUserTable(db)

	c.Status(200)
}
