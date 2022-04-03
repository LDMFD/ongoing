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

type DeleteFundRequestPath struct {
	FundId string `binding:"required"`
}

func DeleteFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var fund = Entities.Fund{}
	if err := db.NewSelect().
		Model(&fund).
		Relation("PolicyFunds").
		Relation("PolicyFunds.Client").
		Where("uid = ?", path.FundId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if len(fund.PolicyFunds) > 0 {
		var names []string
		for _, p := range fund.PolicyFunds {
			s := fmt.Sprintf("%v (in use by %v, %v)", p.Id, p.Client.Forenames, p.Client.Surname)
			names = append(names, s)
		}
		s := fmt.Sprintln(strings.Join(names[:], ", "))
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.FundHasDependentModels(s)})
		return
	}

	if _, err := db.NewDelete().
		Model(&fund).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
