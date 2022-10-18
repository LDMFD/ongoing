package ClientProfile

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"time"
)

func ImportReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreateReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body Entities.ReportReview
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var (
		startDate time.Time
		endDate   time.Time
		err       error
	)
	if startDate, err = time.Parse(time.RFC3339, body.Meta.StartDate); err != nil {
		panic(err)
	}
	if endDate, err = time.Parse(time.RFC3339, body.Meta.EndDate); err != nil {
		panic(err)
	}

	var client *Entities.Client
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		panic(err.Error())
	}

	b, err2 := json.Marshal(body.Report)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err2.Error()})
		panic(err2.Error())
	}
	reportJson := string(b)

	review := &Entities.Review{
		Uid:       body.Id,
		ClientId:  client.Id,
		State:     Entities.ReviewStateFinal,
		StartDate: &startDate,
		EndDate:   &endDate,
		Report:    &reportJson,
	}

	if _, err := db.NewInsert().Model(review).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{})
}
