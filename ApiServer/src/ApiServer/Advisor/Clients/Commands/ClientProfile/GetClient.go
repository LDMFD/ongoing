package ClientProfile

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/Reviews"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetClientRequestPath struct {
	ClientId string `binding:"required"`
}

func GetClient(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client = Entities.Client{}
	if err := db.NewSelect().
		Model(&client).
		Relation("User").
		Where("uid = ?", path.ClientId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var draft gin.H
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
				endDate string
			)
			if draftReviews[0].StartDate != nil {
				startDate = draftReviews[0].StartDate.String()
			}
			if draftReviews[0].StartDate != nil {
				endDate = draftReviews[0].EndDate.String()
			}

			draft = gin.H{
				"Id":        draftReviews[0].Uid,
				"StartDate": startDate,
				"EndDate":   endDate,
			}
		} else if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Integrity error - multiple reviews in draft state"})
		}
	}

	report := Reviews.GenerateReport(c, client.Id)

	c.JSON(200, gin.H{
		"ClientContext": client.ToReport(),
		"Draft":         draft,
		"Report":        report,
		"Reviews":       Reviews.GetReviews(c, &client),
	})
}
