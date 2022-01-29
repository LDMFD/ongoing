package ClientProfile

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateClientRequstBody struct {
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
	Email     string `binding:"required"`
}

func CreateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var req CreateClientRequstBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if exists, err := db.NewSelect().Model((*Entities.User)(nil)).Where("email = ?", req.Email).Exists(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.ClientAlreadyExists})
		return
	}

	uid := strings.ReplaceAll(uuid.NewString(), "-", "")

	var user = Entities.User{
		Uid:       uid,
		Email:     req.Email,
		Type:      Entities.UserTypeClient,
	}
	if _, err := db.NewInsert().Model(&user).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Entities.Client{
		Forenames: req.Forenames,
		Surname:   req.Surname,
		UserId:    user.Id,
	}
	if _, err := db.NewInsert().Model(&client).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}
