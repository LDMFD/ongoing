package Commands

import (
	"net/http"
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetOperatorQuery struct {
	OperatorId int64 `binding:"required"`
}

func GetOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var uri GetOperatorQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var operator = Models.Operator{Id: uri.OperatorId}
	if err := db.NewSelect().
		Model(&operator).
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Operator": operator,
	})
}
