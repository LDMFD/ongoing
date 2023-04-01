package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeletePortfolio(c *gin.Context, tx *bun.Tx, portfolio *Entities.Portfolio) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(portfolio).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}
}
