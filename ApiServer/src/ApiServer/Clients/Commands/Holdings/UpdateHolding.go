package Holdings

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateHoldingRequestPath struct {
	ClientId  int64 `binding:"required"`
	HoldingId int64 `binding:"required"`
}

type CreateOrUpdateHoldingRequestBody struct {
	PolicyId          int64    `binding:"required"`
	PortfolioId       int64    `binding:"required"`
	Proportion        float64  `binding:"required"`
}

func UpdateHolding(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateHoldingRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdateHoldingRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var holding = Models.Holding{Id: path.HoldingId}
	if err := db.NewSelect().
		Model(&holding).
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}

	if holding.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Holding does not belong to client"})
	}

	holding.PolicyId = body.PolicyId
	holding.PortfolioId = body.PortfolioId
	holding.Proportion = body.Proportion

	if _, err := db.NewUpdate().
		Model(&holding).
		WherePK().
		Column("policy_id").
		Column("portfolio_id").
		Column("proportion").
		Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Holding": holding,
	})
}
