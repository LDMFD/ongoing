package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type UpdateReviewModulePath struct {
	ClientId int64 `binding:"required"`
	ReviewId int64 `binding:"required"`
	Module string `binding:"required"`
}

type UpdateReviewModuleRequestBody struct {
	Intro string
	Text string
}

func UpdateReviewModule(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateReviewModulePath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body UpdateReviewModuleRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var review = Entities.Review{Id: path.ReviewId}
	if err := db.NewSelect().
		Model(&review).
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if review.ClientId != path.ClientId {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review does not belong to client"})
		return
	}

	module := &Entities.ReviewModule{
		ReviewId:  path.ReviewId,
		Type:      path.Module,
		Intro:     body.Intro,
		Text:      body.Text,
	}
	if _, err := db.NewInsert().Model(module).
		On("CONFLICT (review_id, \"type\") DO UPDATE").
		Set("\"intro\" = EXCLUDED.intro").
		Set("\"text\" = EXCLUDED.text").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{})
}
