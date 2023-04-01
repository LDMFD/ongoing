package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeletePolicyFund(c *gin.Context, tx *bun.Tx, policyFund *Entities.PolicyFund) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(policyFund).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}
}
