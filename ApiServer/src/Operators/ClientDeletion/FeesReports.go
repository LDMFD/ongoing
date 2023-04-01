package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteFeesReport(c *gin.Context, tx *bun.Tx, clientId string, feesReport *Entities.FeesReport) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(feesReport).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}

	if feesReport.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromClientAndOrg(&ctx, tx, clientId, context.Session.Org.Uid, feesReport.FilePtr.File.Uid); err != nil {
			context.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *feesReport.FilePtr)
	}
}
