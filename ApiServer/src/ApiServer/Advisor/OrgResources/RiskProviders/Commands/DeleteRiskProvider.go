package Commands

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Operators/OrgResourceDeletion"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

type DeleteRiskProviderRequestPath struct {
	RiskProviderId string `binding:"required"`
}

func DeleteRiskProvider(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	var path DeleteRiskProviderRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var query Helpers.ExecuteQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		context.Response.InvalidInput()
		return
	}

	tx, err := context.Db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	ok := OrgResourceDeletion.DeleteRiskProvider(context, &tx, path.RiskProviderId, query.Execute)

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	if ok {
		c.Status(http.StatusOK)
	}
}
