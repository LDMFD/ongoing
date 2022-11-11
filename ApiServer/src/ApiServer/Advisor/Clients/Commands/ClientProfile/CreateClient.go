package ClientProfile

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateOrUpdateClientRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	body.Identity.Email = strings.ToLower(body.Identity.Email)

	if exists, err := db.NewSelect().Model((*Entities.User)(nil)).Where("email = ?", body.Identity.Email).Exists(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.UserAlreadyExists})
		return
	}

	userUid := UUID.GenerateUIDWithKey(c, "user")
	clientUid := UUID.GenerateUIDWithKey(c, "client")

	// Begin transaction
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	var user = Entities.User{
		Uid:       userUid,
		Email:     body.Identity.Email,
		Forenames: body.Identity.Forenames,
		Surname:   body.Identity.Surname,
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

	var client = Entities.Client{
		Uid:    clientUid,
		UserId: user.Id,
		OrgId:  org.Id,
		Fee:    body.Fee,
	}
	if _, err := tx.NewInsert().Model(&client).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, session.UserUid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
	}

	if err := auth.CreateClient(*session.OrgId, advisor.User.Uid, clientUid, userUid); err != nil {
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

	//log.Printf("\ncreate client: %v:\n", body.Identity.Email)

	c.JSON(200, gin.H{
		"Id": clientUid,
	})
}
