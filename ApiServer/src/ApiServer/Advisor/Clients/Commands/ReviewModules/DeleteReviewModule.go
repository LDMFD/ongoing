package ReviewModules

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"
)

type DeleteReviewModulePath struct {
	ClientId string `binding:"required"`
	Module   string `binding:"required"`
	Field    string `binding:"required,oneof=intro text all"`
}

func DeleteReviewModule(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteReviewModulePath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			context.Response.Panic(err)
		}
		return
	}

	module := &Entities.Module{}
	if err := db.NewSelect().
		Model(module).
		Where("client_id = ? AND type = ?", client.Id, path.Module).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}
	if path.Field == "intro" || path.Field == "all" {
		module.Intro = ""
	}
	if path.Field == "text" || path.Field == "all" {
		module.Text = ""
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	if module.Intro == "" && module.Text == "" {
		ClientDeletion.DeleteModule(c, &tx, module)
	} else {
		if _, err := tx.NewUpdate().
			Model(module).
			WherePK().
			Column("intro").
			Column("text").
			Exec(c); err != nil {
			context.Response.Panic(err)
		}
	}

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
