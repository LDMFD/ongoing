package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteReview(c *gin.Context, tx *bun.Tx, client *Entities.Client, review *Entities.ReportReview) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	ctx := c.Request.Context()

	for _, fund := range review.Report.Funds {
		if fund.File == nil {
			continue
		}
		if err := context.Auth.RemoveFileFromClient(&ctx, tx, client.Uid, fund.File.Uid); err != nil {
			context.Response.Panic(err)
		}
	}
	for _, model := range review.Report.Models {
		if model.File == nil {
			continue
		}
		if err := context.Auth.RemoveFileFromClient(&ctx, tx, client.Uid, model.File.Uid); err != nil {
			context.Response.Panic(err)
		}
	}

	if _, err := tx.NewDelete().
		Model((*Entities.Review)(nil)).
		Where("uid = ?", review.Id).
		Exec(c); err != nil {
		context.Response.Panic(err)
	}
}

func DeletePendingReview(c *gin.Context, tx *bun.Tx, clientId int64) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model((*Entities.Review)(nil)).
		Where("client_id = ?", clientId).
		Where("state = ?", Entities.ReviewStateDraft).
		Exec(c); err != nil {
		context.Response.Panic(err)
	}
}
