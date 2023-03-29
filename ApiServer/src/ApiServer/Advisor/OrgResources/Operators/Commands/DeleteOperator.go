package Commands

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Operators/OrgResourceDeletion"
	"ongoing/ServiceContext"
)

type DeleteOperatorRequestPath struct {
	OperatorId string `binding:"required"`
}

func DeleteOperator(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeleteOperatorRequestPath
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

	ok := OrgResourceDeletion.DeleteOperator(context, &tx, path.OperatorId, query.Execute)

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	if ok {
		c.Status(http.StatusOK)
	}
}
