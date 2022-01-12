package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreatePolicyTypeRequest struct {
	Name string `binding:"required"`
}

func CreatePolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var req CreatePolicyTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyType = Entities.PolicyType{
		Name: req.Name,
	}
	if _, err := db.NewInsert().Model(&policyType).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"PolicyType": policyType,
	})
}
