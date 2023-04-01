package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
	"ongoing/Utils/UUID"
	"time"
)

func CreateReview(c *gin.Context, tx bun.Tx, clientId string) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, tx, clientId); err != nil {
		// TODO implement levelled logging, so this stacktrace can be printed as a warning
		//panic(err.Error())
		return
	}

	// Only 1 review in draft state at once
	if exists, err := tx.NewSelect().
		Model((*Entities.Review)(nil)).
		Where("client_id = ?", client.Id).
		Where("state = ?", Entities.ReviewStateDraft).
		Exists(c); err != nil {
		panic(err)
	} else if exists {
		return
	}

	t1 := time.Now()
	t2 := time.Now()

	// Set start date to end date of previous review, plus 1 day
	var previous []Entities.Review
	if count, err := tx.NewSelect().
		Model(&previous).
		Where("client_id = ?", client.Id).
		Where("state = ?", Entities.ReviewStateFinal).
		OrderExpr("id DESC").
		Limit(1).
		ScanAndCount(c); err != nil {
		panic(err)
	} else {
		if count >= 1 {
			t1 = previous[0].EndDate.AddDate(0, 0, 1)
		}
	}

	startDate := time.Date(t1.Year(), t1.Month(), t1.Day(), 0, 0, 0, 0, time.UTC)
	endDate := time.Date(t2.Year(), t2.Month(), t2.Day(), 0, 0, 0, 0, time.UTC)

	if startDate.After(endDate) {
		startDate = endDate
	}

	uid := UUID.GenerateUID(c)

	review := &Entities.Review{
		Uid:       uid,
		ClientId:  client.Id,
		State:     Entities.ReviewStateDraft,
		StartDate: &startDate,
		EndDate:   &endDate,
	}

	if _, err := tx.NewInsert().Model(review).Exec(c); err != nil {
		context.Panic(err)
	}
}
