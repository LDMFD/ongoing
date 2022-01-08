package Commands

import (
	"net/http"
	"ongoing/Models"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreatePortfolioRequestBody struct {
	Name         string  `binding:"required"`
	OperatorId   int64   `binding:"required"`
	WeightedFee  float64 `binding:"required"`
	ExAnteFee    float64 `binding:"required"`
}

func CreatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var req CreatePortfolioRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var portfolio = Models.Portfolio{
		Name: req.Name,
		OperatorId: req.OperatorId,
		WeightedFee: req.WeightedFee,
		ExAnteFee: req.ExAnteFee,
	}
	if _, err := db.NewInsert().Model(&portfolio).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
