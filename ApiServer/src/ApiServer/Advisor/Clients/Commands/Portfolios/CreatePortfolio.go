package Portfolios

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreatePortfolioRequestPath struct {
	ClientId string `binding:"required"`
}

func CreatePortfolio(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreatePortfolioRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePortfolioRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

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

	var portfolio = Entities.Portfolio{
		Uid:        uid,
		ClientId:   client.Id,
		PolicyId:   policy.Id,
		ModelId:    model.Id,
		Proportion: body.Proportion,
	}
	if _, err := db.NewInsert().Model(&portfolio).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Portfolio": portfolio,
	})
}
