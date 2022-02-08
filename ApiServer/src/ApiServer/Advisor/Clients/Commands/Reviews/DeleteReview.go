package Reviews

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteReviewRequestPath struct {
	ClientId int64 `binding:"required"`
	ReviewId int64 `binding:"required"`
}

func DeleteReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteReviewRequestPath
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

	if _, err := db.NewDelete().
		Model(&review).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
