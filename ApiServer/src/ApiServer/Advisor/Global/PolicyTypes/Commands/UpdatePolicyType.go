package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyTypePath struct {
	PolicyTypeId string `binding:"required"`
}

type UpdatePolicyTypeRequest struct {
	Name string `binding:"required"`
}

func UpdatePolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdatePolicyTypePath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var req UpdatePolicyTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyType = Entities.PolicyType{
		Name: req.Name,
	}
	if _, err := db.NewUpdate().
		Model(&policyType).
		Where("uid = ?", path.PolicyTypeId).
		Column("name").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyType": policyType,
	})
}
