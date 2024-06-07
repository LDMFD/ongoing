package Commands

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

type CreateSessionQuery struct {
	State string `binding:"required" form:"state"`
}

type CreateSessionBody struct {
	AccountId string `json:"accountId"`
}

func CreateSession(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var query CreateSessionQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		context.Response.InvalidInput()
		return
	}

	var body CreateSessionBody
	if err := c.ShouldBindJSON(&body); err != nil {
		context.Response.InvalidInput()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	var session = Entities.OAuthSession{}
	if err := db.NewSelect().
		Model(&session).
		Where("state = ?", query.State).
		Scan(c); err != nil {
		context.Panic(err)
	}

	session.Context = body.AccountId

	if _, err := tx.NewUpdate().
		Model(&session).
		Where("state = ?", query.State).
		Column("context").
		Exec(c); err != nil {
		context.Panic(err)
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}
}
