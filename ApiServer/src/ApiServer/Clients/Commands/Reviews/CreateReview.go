package Reviews

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type CreateReviewRequestPath struct {
	ClientId int64 `binding:"required"`
}

func CreateReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var path CreateReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var review = Entities.Review{
		ClientId: path.ClientId,
		State:    "DRAFT",
		Uid:      uid,
	}
	if _, err := db.NewInsert().Model(&review).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Review": review,
	})
}
