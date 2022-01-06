package Commands

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetPolicyTypeQuery struct {
	PolicyTypeId int64 `binding:"required"`
}

func GetPolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri GetPolicyTypeQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyType = Models.PolicyType{Id: uri.PolicyTypeId}
	if err := db.NewSelect().
		Model(&policyType).
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"PolicyType": policyType,
	})
}
