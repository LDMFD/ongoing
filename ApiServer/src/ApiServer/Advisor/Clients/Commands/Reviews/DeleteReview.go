package Reviews

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteReviewRequestPath struct {
	ClientId string `binding:"required"`
	ReviewId string `binding:"required"`
}

func DeleteReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var review = Entities.Review{}
	if err := db.NewSelect().
		Model(&review).
		Where("uid = ?", path.ReviewId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	if review.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&review).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
