package Commands

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePortfolioRequestPath struct {
	PortfolioId int64 `binding:"required"`
}

func UpdatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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
		Id:   		 path.PortfolioId,
		Name: 		 body.Name,
		OperatorId:  body.OperatorId,
		WeightedFee: body.WeightedFee,
		ExAnteFee: 	 body.ExAnteFee,
		FileId:      fileId,
	}
	if _, err := db.NewUpdate().Model(&portfolio).WherePK().
		Column("name").
		Column("operator_id").
		Column("weighted_ocf").
		Column("ex_ante_fee").
		Column("file_id").
		Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
