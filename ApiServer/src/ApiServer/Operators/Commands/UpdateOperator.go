package Commands

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateOperatorQuery struct {
	OperatorId int64 `binding:"required"`
}

type UpdateOperatorRequest struct {
	Name string `binding:"required"`
	Type string `binding:"required,oneof=dim firm individual none"`
	Fee  float64 `binding:"required"`
}

func UpdateOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri UpdateOperatorQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req UpdateOperatorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var operator = Models.Operator{
		Id:        uri.OperatorId,
		Type:      req.Type,
		Name:      req.Name,
		Fee:       req.Fee,
	}
	if _, err := db.NewUpdate().Model(&operator).WherePK().
		Column("type").
		Column("name").
		Column("fee").Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Operator": operator,
	})
}
