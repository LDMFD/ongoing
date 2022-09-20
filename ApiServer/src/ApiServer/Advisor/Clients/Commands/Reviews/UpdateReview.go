package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"time"
)

type UpdateOrPublishReviewRequestPath struct {
	ClientId string `binding:"required"`
	ReviewId string `binding:"required"`
}

type UpdateReviewRequestBody struct {
	StartDate string `binding:"required"`
	EndDate   string `binding:"required"`
}

func UpdateReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateOrPublishReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body UpdateReviewRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

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

	var startDate time.Time
	if startDate, err = Date.FromCanonical(body.StartDate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'startDate' timestamp"})
		return
	}

	var endDate time.Time
	if endDate, err = Date.FromCanonical(body.EndDate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'endDate' timestamp"})
		return
	}

	review.StartDate = &startDate
	review.EndDate = &endDate

	if _, err := db.NewUpdate().
		Model(&review).
		WherePK().
		Column("start_date").
		Column("end_date").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
