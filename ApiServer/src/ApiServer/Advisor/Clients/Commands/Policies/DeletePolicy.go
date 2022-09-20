package Policies

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeletePolicyRequestPath struct {
	ClientId string `binding:"required"`
	PolicyId string `binding:"required"`
}

func DeletePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policy = Entities.Policy{}
	if err := db.NewSelect().
		Model(&policy).
		Relation("Portfolios").
		Where("uid = ?", path.PolicyId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	if policy.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
		panic(err.Error())
	}

	if len(policy.Portfolios) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.PolicyHasDependentPortfolios})
		panic(err.Error())
	}

	if _, err := db.NewDelete().
		Model(&policy).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
