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

type UpdatePortfolioRequestBody struct {
	Name        string  `binding:"required"`
	OperatorId  int64   `binding:"required"`
	WeightedFee float64 `binding:"required"`
	ExAnteFee   float64 `binding:"required"`
}

func UpdatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body UpdatePortfolioRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var portfolio = Models.Portfolio{
		Id:   		 path.PortfolioId,
		Name: 		 body.Name,
		OperatorId:  body.OperatorId,
		WeightedFee: body.WeightedFee,
		ExAnteFee: 	 body.ExAnteFee,
	}
	if _, err := db.NewUpdate().Model(&portfolio).WherePK().
		Column("name").
		Column("operator_id").
		Column("weighted_ocf").
		Column("ex_ante_fee").Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
