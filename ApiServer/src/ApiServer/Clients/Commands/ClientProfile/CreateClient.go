package ClientProfile

import (
	"net/http"
	"ongoing/Models"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateClientRequstBody struct {
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
}

func CreateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var req CreateClientRequstBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{
		Uid:       uid,
		Forenames: req.Forenames,
		Surname:   req.Surname,
	}
	if _, err := db.NewInsert().Model(&client).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}
