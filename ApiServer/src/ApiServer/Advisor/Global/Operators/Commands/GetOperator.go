package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetOperatorRequestPath struct {
	OperatorId int64 `binding:"required"`
}

func GetOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetOperatorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var operator = Entities.Operator{Id: path.OperatorId}
	if err := db.NewSelect().
		Model(&operator).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Operator": operator,
	})
}
