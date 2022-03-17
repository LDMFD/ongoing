package Portfolios

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePortfolioRequestPath struct {
	ClientId    int64 `binding:"required"`
	PortfolioId int64 `binding:"required"`
}

type CreateOrUpdatePortfolioRequestBody struct {
	PolicyId   int64   `binding:"required"`
	ModelId    int64   `binding:"required"`
	Proportion float64 `binding:"required"`
}

func UpdatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePortfolioRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var portfolio = Entities.Portfolio{Id: path.PortfolioId}
	if err := db.NewSelect().
		Model(&portfolio).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if portfolio.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Portfolio does not belong to client"})
		return
	}

	portfolio.PolicyId = body.PolicyId
	portfolio.ModelId = body.ModelId
	portfolio.Proportion = body.Proportion

	if _, err := db.NewUpdate().
		Model(&portfolio).
		WherePK().
		Column("policy_id").
		Column("model_id").
		Column("proportion").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
