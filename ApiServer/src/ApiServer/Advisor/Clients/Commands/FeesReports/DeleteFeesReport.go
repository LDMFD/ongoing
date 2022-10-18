package FeesReports

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteFeesReportRequestPath struct {
	ClientId     string `binding:"required"`
	FeesReportId string `binding:"required"`
}

func DeleteFeesReport(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path DeleteFeesReportRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var feesReport = Entities.FeesReport{}
	if err := db.NewSelect().
		Model(&feesReport).
		Relation("File").
		Where("fees_report.uid = ?", path.FeesReportId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	if feesReport.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Fees report does not belong to client"})
		panic(err.Error())
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if _, err := tx.NewDelete().
		Model(&feesReport).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if feesReport.File != nil {
		if err := auth.RemoveFileFromClientAndOrg(path.ClientId, session.Org.Uid, feesReport.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
