package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteProviderDiscount(c *gin.Context, tx *bun.Tx, providerDiscount *Entities.ProviderDiscount) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(providerDiscount).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}
}
