package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type DeleteReviewModulePath struct {
	ClientId int64 `binding:"required"`
	ReviewId int64 `binding:"required"`
	Module string `binding:"required"`
	Field string `binding:"required,oneof=intro text"`
}

func DeleteReviewModule(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteReviewModulePath
	if err := c.ShouldBindUri(&path); err != nil {
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

	module := &Entities.ReviewModule{}
	if err := db.NewSelect().
		Model(module).
		Where("review_id = ? AND type = ?", path.ReviewId, path.Module).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if path.Field == "intro" {
		module.Intro = ""
	}
	if path.Field == "text" {
		module.Text = ""
	}

	if module.Intro == "" && module.Text == "" {
		if _, err := db.NewDelete().
			Model(module).
			Where("review_id = ? AND type = ?", path.ReviewId, path.Module).
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		if _, err := db.NewUpdate().
			Model(module).
			WherePK().
			Column("intro").
			Column("text").
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{})
	}

	c.JSON(200, gin.H{})
}
