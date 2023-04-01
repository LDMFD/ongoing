package ClientProfile

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

type DeleteClientRequestPath struct {
	ClientId string `binding:"required"`
}

func DeleteClient(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeleteClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var dtoClient *Entities.Client
	var err error
	if dtoClient, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		context.Response.NotFound()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	exportClient, dbClient := GetClientInternal(c, dtoClient)

	ClientDeletion.DeleteClient(c, tx, dbClient, dtoClient, exportClient)

	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, exportClient.Metadata.AdvisorId); err != nil {
		context.Panic(err)
	}

	if _, err := tx.NewDelete().
		Model(dtoClient).
		Where("id = ?", dtoClient.Id).
		Exec(c); err != nil {
		context.Panic(err)
	}

	var user Entities.User
	if _, err := tx.NewDelete().
		Model(&user).
		Where("id = ?", dtoClient.UserId).
		Exec(c); err != nil {
		context.Panic(err)
	}

	ctx := c.Request.Context()
	if err := context.Auth.RemoveClient(&ctx, &tx, *context.Session.OrgId, advisor.User.Uid, path.ClientId, dtoClient.User.Uid); err != nil {
		context.Panic(err)
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	c.Status(http.StatusOK)
}
