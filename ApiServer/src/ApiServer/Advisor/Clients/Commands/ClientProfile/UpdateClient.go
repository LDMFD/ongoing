package ClientProfile

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
)

type UpdateClientRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdateClientRequestBody struct {
	Identity struct {
		Forenames string `binding:"required"`
		Surname   string `binding:"required"`
		Email     string `binding:"required"`
	} `binding:"required"`
	Fee float64 // allow 0 - `binding:"required"`
}

func UpdateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateClientRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	body.Identity.Email = strings.ToLower(body.Identity.Email)

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	client.Fee = body.Fee

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer tx.Rollback()

	if _, err := tx.NewUpdate().Model(client).WherePK().
		Column("fee").
		Exec(c); err != nil {
		tx.Rollback()
		Errors.Unexpected(c, err)
		return
	}

	if err := tx.NewSelect().
		Model(client).
		Relation("User").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	emailChange := body.Identity.Email != client.User.Email
	nameChange := body.Identity.Surname != client.User.Surname || body.Identity.Forenames != client.User.Forenames

	if emailChange || nameChange {
		client.User.Email = strings.TrimSpace(body.Identity.Email)
		client.User.Forenames = strings.TrimSpace(body.Identity.Forenames)
		client.User.Surname = strings.TrimSpace(body.Identity.Surname)
		if _, err := db.NewUpdate().Model(&client.User).WherePK().
			Column("email").
			Column("forenames").
			Column("surname").
			Exec(c); err != nil {
			tx.Rollback()
			Errors.Unexpected(c, err)
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{
		"Client": client,
	})
}
