package Portfolios

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeletePortfolioRequestPath struct {
	ClientId    int64 `binding:"required"`
	PortfolioId int64 `binding:"required"`
}

func DeletePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var portfolio = Entities.Portfolio{Id: path.PortfolioId}
	if err := db.NewSelect().
		Model(&portfolio).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if portfolio.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Portfolio does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&portfolio).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
