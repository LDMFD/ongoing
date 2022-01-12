package Policies

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetPolicyRequestPath struct {
	ClientId int64 `binding:"required"`
	PolicyId int64 `binding:"required"`
}

func GetPolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetPolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policy = Entities.Policy{Id: path.PolicyId}
	if err := db.NewSelect().
		Model(&policy).
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}

	if policy.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
	}

	c.JSON(200, gin.H{
		"Policy": policy,
	})
}
