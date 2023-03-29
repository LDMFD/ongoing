package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteFactFind(c *gin.Context, tx *bun.Tx, clientId string, factFind *Entities.FactFind) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(factFind).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}

	if factFind.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromClientAndOrg(&ctx, tx, clientId, context.Session.Org.Uid, factFind.FilePtr.File.Uid); err != nil {
			context.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *factFind.FilePtr)
	}
}
