package Commands

import (
	"net/http"
	"ongoing/Models"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdatePortfolioRequestBody struct {
	Name         string  `binding:"required"`
	OperatorId   int64   `binding:"required"`
	WeightedFee  float64 `binding:"required"`
	ExAnteFee    float64 `binding:"required"`
	FileUid      *string
}

func CreatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var body CreateOrUpdatePortfolioRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var fileId *int64
	if body.FileUid != nil {
		var file Models.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", *body.FileUid).ScanAndCount(c); err != nil {
			panic(err)
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		fileId = &file.Id
	}

	var portfolio = Models.Portfolio{
		Name: 		 body.Name,
		OperatorId:  body.OperatorId,
		WeightedFee: body.WeightedFee,
		ExAnteFee:   body.ExAnteFee,
		FileId: 	 fileId,
	}
	if _, err := db.NewInsert().Model(&portfolio).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
