package ClientProfile

import (
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/Date"
)

func GetReviews(c *gin.Context, client *Entities.Client) []Entities.ReportReview {
	db := c.MustGet("DATABASE").(*bun.DB)

	var reviews = []*Entities.Review{}
	if err := db.NewSelect().
		Model(&reviews).
		Where("client_id = ?", client.Id).
		Where("state = ?", Entities.ReviewStateFinal).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	res := make([]Entities.ReportReview, 0, len(reviews))
	for _, r := range reviews {
		var rep Entities.ReportDetail
		s := bytes.NewBufferString(*r.Report)
		err := json.Unmarshal(s.Bytes(), &rep)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
		rep.Id = r.Uid
		res = append(res, Entities.ReportReview{
			Id: r.Uid,
			Meta: Entities.ReportReviewMeta{
				StartDate:     Date.ToCanonical(r.StartDate),
				EndDate:       Date.ToCanonical(r.EndDate),
				FinalizedDate: Date.ToCanonical(&r.FinalizedDate),
				//State:         r.State,
			},
			Report: rep,
		})
	}

	return res
}
