package Policies

import (
	"database/sql"
	"ongoing/ApiServer/Helpers"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

type DeletePolicyRequestPath struct {
	ClientId string `binding:"required"`
	PolicyId string `binding:"required"`
}

func DeletePolicy(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	response := &context.Response

	var path DeletePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		response.InvalidInput()
		return
	}

	var query Helpers.ExecuteQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.InvalidInput()
		return
	}

	tx, err := context.Db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		response.Panic(err)
	}
	defer tx.Rollback()

	ok := ClientDeletion.DeletePolicy(context, &tx, path.ClientId, path.PolicyId, query.Execute)

	if err := tx.Commit(); err != nil {
		response.Panic(err)
	}

	if ok {
		response.ReturnOK()
	}
}
