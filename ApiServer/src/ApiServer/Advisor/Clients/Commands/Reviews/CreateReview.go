package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"
	"time"
)

type CreateReviewRequestPath struct {
	ClientId string `binding:"required"`
}

func CreateReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreateReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	// Only 1 review in draft state at once
	if exists, err := db.NewSelect().
		Model((*Entities.Review)(nil)).
		Where("client_id = ?", client.Id).
		Where("state = ?", Entities.ReviewStateDraft).
		Exists(c); err != nil {
		panic(err)
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only 1 review can be in draft at a time"})
		return
	}

	t1 := time.Now()
	t2 := time.Now()

	// Set start date to end date of previous review, plus 1 day
	var previous []Entities.Review
	if count, err := db.NewSelect().
		Model(&previous).
		Where("client_id = ?", client.Id).
		Where("state = ?", Entities.ReviewStateFinal).
		OrderExpr("id DESC").
		Limit(1).
		ScanAndCount(c); err != nil {
		panic(err)
	} else {
		if count == 1 {
			t1 = previous[0].EndDate.AddDate(0, 0, 1)
		}
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	startDate := time.Date(t1.Year(), t1.Month(), t1.Day(), 0, 0, 0, 0, time.UTC)
	endDate := time.Date(t2.Year(), t2.Month(), t2.Day(), 0, 0, 0, 0, time.UTC)

	review := &Entities.Review{
		Uid:       uid,
		ClientId:  client.Id,
		State:     Entities.ReviewStateDraft,
		StartDate: &startDate,
		EndDate:   &endDate,
	}

	if _, err := db.NewInsert().Model(review).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Review": review,
	})
}
