package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteModule(c *gin.Context, tx *bun.Tx, module *Entities.Module) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(module).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}
}
