package FeesReports

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
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

	var path DeleteFeesReportRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var feesReport = Entities.FeesReport{}
	if err := db.NewSelect().
		Model(&feesReport).
		Where("uid = ?", path.FeesReportId).
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

	if _, err := db.NewDelete().
		Model(&feesReport).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
