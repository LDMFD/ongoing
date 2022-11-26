package Portfolios

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeletePortfolioRequestPath struct {
	ClientId    string `binding:"required"`
	PortfolioId string `binding:"required"`
}

func DeletePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var portfolio = Entities.Portfolio{}
	if err := db.NewSelect().
		Model(&portfolio).
		Where("uid = ?", path.PortfolioId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	if portfolio.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Portfolio does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&portfolio).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
