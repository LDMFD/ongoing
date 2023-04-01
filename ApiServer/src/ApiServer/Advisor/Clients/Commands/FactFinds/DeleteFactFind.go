package FactFinds

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

type DeleteFactFindRequestPath struct {
	ClientId   string `binding:"required"`
	FactFindId string `binding:"required"`
}

func DeleteFactFind(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeleteFactFindRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var factFind = Entities.FactFind{}
	if err := db.NewSelect().
		Model(&factFind).
		Relation("FilePtr.File").
		Where("fact_find.uid = ?", path.FactFindId).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}

	if client, err := Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	} else if factFind.ClientId != client.Id {
		context.Response.NotFound()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	ClientDeletion.DeleteFactFind(c, &tx, path.ClientId, &factFind)

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
