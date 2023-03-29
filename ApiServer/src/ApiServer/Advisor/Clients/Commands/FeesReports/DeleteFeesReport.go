package FeesReports

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

type DeleteFeesReportRequestPath struct {
	ClientId     string `binding:"required"`
	FeesReportId string `binding:"required"`
}

func DeleteFeesReport(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeleteFeesReportRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var feesReport = Entities.FeesReport{}
	if err := db.NewSelect().
		Model(&feesReport).
		Relation("FilePtr.File").
		Where("fees_report.uid = ?", path.FeesReportId).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	} else if feesReport.ClientId != client.Id {
		context.Response.NotFound()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	ClientDeletion.DeleteFeesReport(c, &tx, path.ClientId, &feesReport)

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
