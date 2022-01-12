package Portfolios

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type CreatePortfolioRequestPath struct {
	ClientId int64 `binding:"required"`
}

func CreatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreatePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdatePortfolioRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var portfolio = Entities.Portfolio{
		ClientId:   path.ClientId,
		PolicyId:   body.PolicyId,
		ModelId:    body.ModelId,
		Proportion: body.Proportion,
	}
	if _, err := db.NewInsert().Model(&portfolio).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
