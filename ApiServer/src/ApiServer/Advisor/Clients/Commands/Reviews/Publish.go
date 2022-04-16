package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type PublishReviewPath struct {
	ReviewId string `binding:"required"`
}

func Publish(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path PublishReviewPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var review = Entities.Review{}
	if err := db.NewSelect().
		Model(&review).
		Where("review.uid = ?", path.ReviewId).
		Relation("Client.User").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review not found: " + path.ReviewId})
		panic(err.Error())
	}

	//if review.State != Entities.ReviewStateDraft {
	//	c.JSON(http.StatusBadRequest, gin.H{"error": "Review not in draft state"})
	//	panic(errors.New("Review not in draft state"))
	//}
	//
	//review.State = Entities.ReviewStateFinal

	if _, err := db.NewUpdate().Model(&review).WherePK().
		Column("state").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}

