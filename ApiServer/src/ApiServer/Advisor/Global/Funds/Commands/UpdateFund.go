package Commands

import (
	"net/http"
	"ongoing/Entities"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateFundRequestPath struct {
	FundId string `binding:"required"`
}

func UpdateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
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

	var modified time.Time
	var err error
	if body.Modified != "" {
		if modified, err = time.Parse("2006-01-02", body.Modified); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'modified' timestamp"})
			return
		}
	}

	var fund = Entities.Fund{
		Name:      body.Name,
		OcfFee:    body.OcfFee,
		ExAnteFee: body.ExAnteFee,
		Modified:  &modified,
		FileId:    fileId,
	}
	if _, err := db.NewUpdate().Model(&fund).Where("uid = ?", path.FundId).
		Column("name").
		Column("ocf_fee").
		Column("ex_ante_fee").
		Column("file_id").
		Column("modified").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Fund": fund,
	})
}
