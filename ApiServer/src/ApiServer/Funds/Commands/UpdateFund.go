package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateFundRequestPath struct {
	FundId int64 `binding:"required"`
}

func UpdateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var fund = Entities.Fund{
		Id:          path.FundId,
		Name:        body.Name,
		WeightedFee: body.WeightedFee,
		ExAnteFee:   body.ExAnteFee,
	}
	if _, err := db.NewUpdate().Model(&fund).WherePK().
		Column("name").
		Column("weighted_ocf").
		Column("ex_ante_fee").
		Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Fund": fund,
	})
}
