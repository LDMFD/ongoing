package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateFundRequestBody struct {
	Name      string  `binding:"required"`
	OcfFee    float64 `binding:"required"`
	ExAnteFee float64 `binding:"required"`
	File *Entities.RequestFile
}

func CreateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var fileId *int64
	if body.File != nil {
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

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var fund = Entities.Fund{
		Uid:       uid,
		Name:      body.Name,
		OcfFee:    body.OcfFee,
		ExAnteFee: body.ExAnteFee,
		FileId:    fileId,
	}
	if _, err := db.NewInsert().Model(&fund).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Fund": fund,
	})
}
