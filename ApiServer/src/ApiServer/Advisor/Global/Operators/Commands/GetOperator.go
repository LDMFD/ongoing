package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetOperatorRequestPath struct {
	OperatorId string `binding:"required"`
}

func GetOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetOperatorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var operator = Entities.Operator{}
	if err := db.NewSelect().
		Model(&operator).
		Where("uid = ?", path.OperatorId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Operator": operator,
	})
}
