package Commands

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/Entities"
	"ongoing/ServiceContext"
	"ongoing/Utils/UUID"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreateAdvisorRequestBody struct {
	Email     string `binding:"required"`
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
	Role      string `binding:"required"` // TODO validate 'administrator' / 'advisor'
}

func CreateAdvisor(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db
	auth := context.Auth
	session := context.Session
	response := context.Response

	var body CreateAdvisorRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	body.Email = strings.ToLower(body.Email)

	if exists, err := db.NewSelect().Model((*Entities.User)(nil)).Where("email = ?", body.Email).Exists(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} else if exists {
		response.UniqueViolation()
		return
	}

	userUid := UUID.GenerateUIDWithKey(c, "user")
	advisorUid := UUID.GenerateUIDWithKey(c, "advisor")

	// Begin transaction
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}
	defer tx.Rollback()

	var user = Entities.User{
		Uid:       userUid,
		Email:     body.Email,
		Forenames: body.Forenames,
		Surname:   body.Surname,
	}
	if _, err := tx.NewInsert().
		Model(&user).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	org := Entities.Organisation{}
	if err := tx.NewSelect().
		Model(&org).
		Where("uid = ?", session.OrgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	var advisor = Entities.Advisor{
		Uid:    advisorUid,
		UserId: user.Id,
		OrgId:  org.Id,
	}
	if _, err := tx.NewInsert().Model(&advisor).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	ctx := c.Request.Context()
	if err := auth.CreateAdvisor(&ctx, &tx, *session.OrgId, userUid, body.Role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{
		"Id": userUid,
	})
}
