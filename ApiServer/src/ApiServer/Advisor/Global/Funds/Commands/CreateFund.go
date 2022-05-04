package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateFundRequestBody struct {
	Name      string  `binding:"required"`
	OcfFee    float64 `binding:"required"`
	ExAnteFee float64 `binding:"required"`
	Modified  string
	File      *Entities.RequestFile
}

func CreateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

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

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var modified time.Time
	var err error
	if body.Modified != "" {
		if modified, err = time.Parse("2006-01-02", body.Modified); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'modified' timestamp"})
			return
		}
	}

	var fund = Entities.Fund{
		Uid:       uid,
		Name:      body.Name,
		OcfFee:    body.OcfFee,
		ExAnteFee: body.ExAnteFee,
		FileId:    fileId,
		Modified:  &modified,
	}
	if _, err := db.NewInsert().Model(&fund).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Fund": fund,
	})
}
