package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOperatorRequestBody struct {
	Name string `binding:"required"`
	Type string `binding:"required,oneof=dim firm individual none"`
	Fee  float64 `binding:"required"`
}

func CreateOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var req CreateOperatorRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var operator = Entities.Operator{
		Type:      req.Type,
		Name:      req.Name,
		Fee:       req.Fee,
	}
	if _, err := db.NewInsert().Model(&operator).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{
		"Operator": operator,
	})
}
