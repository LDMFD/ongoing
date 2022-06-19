package FeesReports

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	Date "ongoing/Utils"
	"time"

	"github.com/gin-gonic/gin"
)

type UpdateFeesReportRequestPath struct {
	ClientId     string `binding:"required"`
	FeesReportId string `binding:"required"`
}

func UpdateFeesReport(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateFeesReportRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFeesReportRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
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

	client := Entities.ClientFromUserUID(c, db, path.ClientId)
	if feesReport.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Risk Assessment does not belong to client"})
		return
	}

	var fileId *int64
	if body.File != nil && body.File.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.File.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		fileId = &file.Id
	}

	var submitted time.Time
	var err error
	if submitted, err = Date.FromCanonical(body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		return
	}

	feesReport.Submitted = submitted
	feesReport.FileId = fileId

	if _, err := db.NewUpdate().
		Model(&feesReport).
		WherePK().
		Column("file_id").
		Column("submitted").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"FeesReport": feesReport,
	})
}
