package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateOperatorRequestPath struct {
	OperatorId int64 `binding:"required"`
}

type UpdateOperatorRequestBody struct {
	Name string `binding:"required"`
	Type string `binding:"required,oneof=dim firm individual none"`
	Fee  float64 `binding:"required"`
}

func UpdateOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateOperatorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body UpdateOperatorRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var operator = Entities.Operator{
		Id:        path.OperatorId,
		Type:      body.Type,
		Name:      body.Name,
		Fee:       body.Fee,
	}
	if _, err := db.NewUpdate().Model(&operator).WherePK().
		Column("type").
		Column("name").
		Column("fee").Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Operator": operator,
	})
}
