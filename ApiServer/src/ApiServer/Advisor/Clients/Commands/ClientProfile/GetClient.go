package ClientProfile

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/Reviews"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Utils/Date"

	"github.com/gin-gonic/gin"
)

type GetClientRequestPath struct {
	ClientId string `binding:"required"`
}

type Draft struct {
	Id        string
	StartDate string
	EndDate   string
}

type GetClientResponse struct {
	Metadata Entities.ClientReport
	Draft    *Draft
	Report        Entities.ReportDetail
	Reviews       []Entities.ReportReview
}

func GetClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		// TODO implement levelled logging, so this stacktrace can be printed as a warning
		//panic(err.Error())
		return
	}

	c.JSON(200, GetClientInternal(c, client))
}

func GetClientInternal(c *gin.Context, client *Entities.Client) *GetClientResponse {
	db := c.MustGet("DATABASE").(*bun.DB)

	var draft Draft
	var draftReviews []Entities.Review
	if count, err := db.NewSelect().
		Model(&draftReviews).
		Where("state = ?", Entities.ReviewStateDraft).
		Where("client_id = ?", client.Id).
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

			draft = Draft{
				Id:        draftReviews[0].Uid,
				StartDate: startDate,
				EndDate:   endDate,
			}
		} else if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Integrity error - multiple reviews in draft state"})
		}
	}

	report := Reviews.GenerateReport(c, client.Id, false)

	return &GetClientResponse{
		Metadata: client.ToReport(),
		Draft:         draft,
		Report:        *report,
		Reviews:       Reviews.GetReviews(c, client),
	}
}
