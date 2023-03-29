package ClientProfile

import (
	"database/sql"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
	"ongoing/Utils/UUID"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateClient(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db
	auth := context.Auth
	session := context.Session
	response := context.Response

	var body CreateOrUpdateClientRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		response.InvalidInput()
		return
	}
	body.Identity.Email = strings.ToLower(body.Identity.Email)

	if exists, err := db.NewSelect().
		Model((*Entities.User)(nil)).
		Where("email = ?", body.Identity.Email).
		Exists(c); err != nil {
		response.NotFound()
		return
	} else if exists {
		response.UniqueViolation()
		return
	}

	userUid := UUID.GenerateUIDWithKey(c, "user")
	clientUid := UUID.GenerateUIDWithKey(c, "client")

	// Begin transaction
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		response.Panic(err)
	}
	defer tx.Rollback()

	var user = Entities.User{
		Uid:       userUid,
		Email:     strings.TrimSpace(body.Identity.Email),
		Forenames: strings.TrimSpace(body.Identity.Forenames),
		Surname:   strings.TrimSpace(body.Identity.Surname),
	}
	if _, err := tx.NewInsert().
		Model(&user).
		Exec(c); err != nil {
		_ = tx.Rollback()
		response.Panic(err)
	}

	org := Entities.Organisation{}
	if err := tx.NewSelect().
		Model(&org).
		Where("uid = ?", session.OrgId).
		Scan(c); err != nil {
		_ = tx.Rollback()
		response.Panic(err)
	}

	var client = Entities.Client{
		Uid:    clientUid,
		UserId: user.Id,
		OrgId:  org.Id,
		Fee:    body.Fee,
	}
	if _, err := tx.NewInsert().Model(&client).Exec(c); err != nil {
		_ = tx.Rollback()
		response.Panic(err)
	}

	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, session.UserUid); err != nil {
		_ = tx.Rollback()
		response.Panic(err)
	}

	ctx := c.Request.Context()
	if err := auth.CreateClient(&ctx, &tx, *session.OrgId, advisor.User.Uid, clientUid, userUid); err != nil {
		_ = tx.Rollback()
		response.Panic(err)
	}

	if err := tx.Commit(); err != nil {
		response.Panic(err)
	}

	response.ReturnID(&clientUid)
}
