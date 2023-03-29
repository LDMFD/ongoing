package Commands

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Operators/OrgResourceDeletion"
	"ongoing/ServiceContext"
)

type DeleteFundRequestPath struct {
	FundId string `binding:"required"`
}

func DeleteFund(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeleteFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var query Helpers.ExecuteQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		context.Response.InvalidInput()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	ok := OrgResourceDeletion.DeleteFund(context, &tx, path.FundId, query.Execute)

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	if ok {
		c.Status(http.StatusOK)
	}
}
