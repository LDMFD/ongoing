package Commands

import (
	"fmt"
	"net/http"
	"ongoing/ApiServer/Errors"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteOperatorRequestPath struct {
	OperatorId int64 `binding:"required"`
}

func DeleteOperator(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteOperatorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var operator = Entities.Operator{Id: path.OperatorId}
	if err := db.NewSelect().
		Model(&operator).
		Relation("Models").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(operator.Models) > 0 {
		var names []string
		for _, m := range operator.Models {
			names = append(names, m.Name)
		}
		s := fmt.Sprintln(strings.Join(names[:], ", "))
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.OperatorHasDependentModels(s)})
		return
	}

	if _, err := db.NewDelete().
		Model(&operator).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
