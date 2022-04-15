package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateModelRequestBody struct {
	Name              string  `binding:"required"`
	OperatorId        string  `binding:"required"`
	WeightedOcfFee    float64 `binding:"required"`
	WeightedExAnteFee float64 `binding:"required"`
	File *Entities.RequestFile
}

func CreateModel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body CreateOrUpdateModelRequestBody
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

	var operator = Entities.Operator{}
	if err := db.NewSelect().
		Model(&operator).
		Where("uid = ?", body.OperatorId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var model = Entities.Model{
		Uid:               uid,
		Name:              body.Name,
		OperatorId:        operator.Id,
		WeightedOcfFee:    body.WeightedOcfFee,
		WeightedExAnteFee: body.WeightedExAnteFee,
		FileId:            fileId,
	}
	if _, err := db.NewInsert().Model(&model).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Model": model,
	})
}
