package Commands

import (
	"fmt"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteModelRequestPath struct {
	ModelId int64 `binding:"required"`
}

func DeleteModel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteModelRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var model = Entities.Model{Id: path.ModelId}
	if err := db.NewSelect().
		Model(&model).
		Relation("Portfolios").
		Relation("Portfolios.Client").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(model.Portfolios) > 0 {
		var names []string
		for _, p := range model.Portfolios {
			s := fmt.Sprintf("%v (in use by %v, %v)", p.Id, p.Client.Forenames, p.Client.Surname)
			names = append(names, s)
		}
		s := fmt.Sprintln(strings.Join(names[:], ", "))
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.ModelHasDependentPortfolios(s)})
		return
	}

	if _, err := db.NewDelete().
		Model(&model).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
