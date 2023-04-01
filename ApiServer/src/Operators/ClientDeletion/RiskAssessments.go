package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteRiskAssessment(c *gin.Context, tx *bun.Tx, clientId string, riskAssessment *Entities.RiskAssessment) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(riskAssessment).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}

	if riskAssessment.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromClientAndOrg(&ctx, tx, clientId, context.Session.Org.Uid, riskAssessment.FilePtr.File.Uid); err != nil {
			context.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *riskAssessment.FilePtr)
	}
}
