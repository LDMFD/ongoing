package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
)

type CreateOrUpdateOperatorRequestBody struct {
	Name string `binding:"required"`
	Type string `binding:"required,oneof=dim firm individual none"`
	Fee  float64
}

func CreateOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var req CreateOrUpdateOperatorRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := UUID.GenerateUID(c)

	var operator = Entities.Operator{
		Uid:   uid,
		Type:  req.Type,
		Name:  req.Name,
		Fee:   req.Fee,
		OrgId: session.Org.Id,
	}
	if _, err := db.NewInsert().Model(&operator).Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}
	c.JSON(200, gin.H{
		"Id": uid,
	})
}
