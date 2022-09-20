package Commands

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreateAdvisorRequestBody struct {
	Email     string `binding:"required"`
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
	Role      string `binding:"required"`
}

func CreateAdvisor(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

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
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.UserAlreadyExists})
		return
	}

	userUid := UUID.GenerateUID(c)
	advisorUid := UUID.GenerateUID(c)

	// Begin transaction
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	var user = Entities.User{
		Uid:   userUid,
		Email: body.Email,
	}
	if _, err := tx.NewInsert().
		Model(&user).
		Returning("Id"). // not working
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	if err := tx.NewSelect().
		Model(&user).
		Where("email = ?", body.Email).
		Scan(c); err != nil {
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
		Uid:       advisorUid,
		UserId:    user.Id,
		OrgId:     org.Id,
		Forenames: body.Forenames,
		Surname:   body.Surname,
	}
	if _, err := tx.NewInsert().Model(&advisor).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	if err := auth.CreateAdvisor(*session.OrgId, userUid, body.Role); err != nil {
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
