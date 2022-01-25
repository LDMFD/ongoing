package Policies

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeletePolicyRequestPath struct {
	ClientId int64 `binding:"required"`
	PolicyId int64 `binding:"required"`
}

func DeletePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policy = Entities.Policy{Id: path.PolicyId}
	if err := db.NewSelect().
		Model(&policy).
		Relation("Portfolios").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if policy.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
		return
	}

	if len(policy.Portfolios) > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.PolicyHasDependentPortfolios})
		return
	}

	if _, err := db.NewDelete().
		Model(&policy).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
