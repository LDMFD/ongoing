package Commands

import (
	"database/sql"
	"fmt"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/AuthService"
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
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path DeleteFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var fund = Entities.Fund{}
	if err := db.NewSelect().
		Model(&fund).
		Relation("File").
		Relation("PolicyFunds").
		Relation("PolicyFunds.Client").
		Where("fund.uid = ?", path.FundId).
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

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if _, err := tx.NewDelete().
		Model(&fund).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if fund.File != nil {
		if err := auth.RemoveFileFromOrg(&session.Org.Uid, fund.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
