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

func CreateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body CreateOrUpdateClientRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if exists, err := db.NewSelect().Model((*Entities.User)(nil)).Where("email = ?", body.Identity.Email).Exists(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.ClientAlreadyExists})
		return
	}

	uid := strings.ReplaceAll(uuid.NewString(), "-", "")

	var user = Entities.User{
		Uid:   uid,
		Email: body.Identity.Email,
		Type:  Entities.UserTypeClient,
	}
	if _, err := db.NewInsert().
		Model(&user).
		Returning("Id").  // not working
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if err := db.NewSelect().
		Model(&user).
		Where("email = ?", body.Identity.Email).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client = Entities.Client{
		UserId:    user.Id,
		Forenames: body.Identity.Forenames,
		Surname:   body.Identity.Surname,
		Fee:       body.Fee,
	}
	if _, err := db.NewInsert().Model(&client).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}
