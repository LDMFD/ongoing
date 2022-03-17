package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyTypeQuery struct {
	PolicyTypeId int64 `binding:"required"`
}

type UpdatePolicyTypeRequest struct {
	Name string `binding:"required"`
}

func UpdatePolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri UpdatePolicyTypeQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var req UpdatePolicyTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyType = Entities.PolicyType{
		Id:   uri.PolicyTypeId,
		Name: req.Name,
	}
	if _, err := db.NewUpdate().Model(&policyType).WherePK().Column("name").Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyType": policyType,
	})
}
