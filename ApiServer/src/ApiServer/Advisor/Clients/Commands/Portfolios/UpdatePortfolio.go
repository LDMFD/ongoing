package Portfolios

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePortfolioRequestPath struct {
	ClientId    string `binding:"required"`
	PortfolioId string `binding:"required"`
}

type CreateOrUpdatePortfolioRequestBody struct {
	PolicyId   string  `binding:"required"`
	ModelId    string  `binding:"required"`
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

	var policy = Entities.Policy{}
	if err := db.NewSelect().
		Model(&policy).
		Where("uid = ?", body.PolicyId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var model = Entities.Model{}
	if err := db.NewSelect().
		Model(&model).
		Where("uid = ?", body.ModelId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	portfolio.PolicyId = policy.Id
	portfolio.ModelId = model.Id
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
