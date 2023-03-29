package ProviderDiscount

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteProviderDiscountRequestPath struct {
	ClientId           string `binding:"required"`
	ProviderDiscountId string `binding:"required"`
}

func DeleteProviderDiscount(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteProviderDiscountRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var providerDiscount = Entities.ProviderDiscount{}
	if err := db.NewSelect().
		Model(&providerDiscount).
		Where("uid = ?", path.ProviderDiscountId).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			context.Response.Panic(err)
		}
		return
	}

	if providerDiscount.ClientId != client.Id {
		context.Response.NotFound()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	ClientDeletion.DeleteProviderDiscount(c, &tx, &providerDiscount)

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
