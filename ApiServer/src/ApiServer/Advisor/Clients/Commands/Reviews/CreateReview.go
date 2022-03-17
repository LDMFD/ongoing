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
		panic(err.Error())
	}

	// Only 1 review in draft state at once
	if exists, err := db.NewSelect().Model((*Entities.Review)(nil)).Where("state != ?", Entities.ReviewStateFinal).Exists(c); err != nil {
		panic(err)
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only 1 review can be in draft at a time"})
		return
	}

	review := &Entities.Review{
		Uid:      uid,
		ClientId: path.ClientId,
		State:    Entities.ReviewStateDraft,
	}
	if _, err := db.NewInsert().Model(review).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Review": review,
	})
}
