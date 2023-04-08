package ClientProfile

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"ongoing/Entities"
	"ongoing/Operators/Reviews"
	"ongoing/ServiceContext"
	"ongoing/Utils/Date"
)

func GetClientInternal(c *gin.Context, dbClient *Entities.Client) (*Entities.ExportClient, *Entities.Client) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	tx, err := context.Db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	Reviews.CreateReview(c, tx, dbClient.Uid)

	var draft *Entities.Draft
	var draftReviews []Entities.Review
	if count, err := tx.NewSelect().
		Model(&draftReviews).
		Where("state = ?", Entities.ReviewStateDraft).
		Where("client_id = ?", dbClient.Id).
		OrderExpr("id").
		ScanAndCount(c); err != nil {
		context.Panic(err)
	} else {
		if count == 1 {
			var (
				startDate string
				endDate   string
			)
			if draftReviews[0].StartDate != nil {
				startDate = Date.ToCanonical(draftReviews[0].StartDate)
			}
			if draftReviews[0].StartDate != nil {
				endDate = Date.ToCanonical(draftReviews[0].EndDate)
			}

			draft = &Entities.Draft{
				Id:        draftReviews[0].Uid,
				StartDate: startDate,
				EndDate:   endDate,
			}
		} else if count > 0 {
			context.Panic(errors.New("Multiple drafts found for client"))
		}
	}

	report, dbClient := GenerateReport(c, &tx, dbClient.Id, false)

	exportClient := &Entities.ExportClient{
		Metadata: dbClient.ToReport(),
		Draft:    draft,
		Report:   *report,
		Reviews:  GetReviews(c, dbClient),
	}
	if advisorId, err := context.Auth.GetAdvisor(dbClient.Uid); err != nil {
		context.Panic(err)
	} else {
		exportClient.Metadata.AdvisorId = advisorId
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	return exportClient, dbClient
}
