package ClientProfile

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/Date"
)

func GetClientInternal(c *gin.Context, dbClient *Entities.Client) (*Entities.ExportClient, *Entities.Client) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var draft *Entities.Draft
	var draftReviews []Entities.Review
	if count, err := db.NewSelect().
		Model(&draftReviews).
		Where("state = ?", Entities.ReviewStateDraft).
		Where("client_id = ?", dbClient.Id).
		ScanAndCount(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
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
			c.JSON(http.StatusBadRequest, gin.H{"error": "Integrity error - multiple reviews in draft state"})
		}
	}

	report, dbClient := GenerateReport(nil, c, dbClient.Id)

	exportClient := &Entities.ExportClient{
		Metadata: dbClient.ToReport(),
		Draft:    draft,
		Report:   *report,
		Reviews:  GetReviews(c, dbClient),
	}
	if advisorId, err := auth.GetAdvisor(dbClient.Uid, &dbClient.User.Uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} else {
		exportClient.Metadata.AdvisorId = advisorId
	}
	return exportClient, dbClient
}
