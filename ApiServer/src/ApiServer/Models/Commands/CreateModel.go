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
	Name        string  `binding:"required"`
	OperatorId  int64   `binding:"required"`
	WeightedFee float64 `binding:"required"`
	ExAnteFee   float64 `binding:"required"`
	FileUid     *string
}

func CreateModel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var body CreateOrUpdateModelRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var fileId *int64
	if body.FileUid != nil {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", *body.FileUid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		fileId = &file.Id
	}

	var model = Entities.Model{
		Name:        body.Name,
		OperatorId:  body.OperatorId,
		WeightedFee: body.WeightedFee,
		ExAnteFee:   body.ExAnteFee,
		FileId:      fileId,
	}
	if _, err := db.NewInsert().Model(&model).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"Model": model,
	})
}
