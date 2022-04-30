package Reviews

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"time"
)

func PublishReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateOrPublishReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	var review = Entities.Review{}
	if err := db.NewSelect().
		Model(&review).
		Where("state = ?", Entities.ReviewStateDraft).
		Where("uid = ?", path.ReviewId).
		Where("client_id = ?", client.Id).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if review.StartDate == nil || review.EndDate == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review start or end dates not set"})
		return
	}
	if review.StartDate.After(*review.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review start dates is after end date"})
		return
	}

	report := GenerateReport(c, client.Id)

	b, err := json.Marshal(report)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	reportJson := string(b)

	review.Report = &reportJson
	review.State = Entities.ReviewStateFinal
	review.FinalizedDate = time.Now()

	if _, err := db.NewUpdate().
		Model(&review).
		WherePK().
		Column("report").
		Column("state").
		Column("finalized_date").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
