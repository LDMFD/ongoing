package Reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"
	"time"
)

type CreateReviewRequestPath struct {
	ClientId string `binding:"required"`
}

func CreateReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreateReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	// Only 1 review in draft state at once
	if exists, err := db.NewSelect().
		Model((*Entities.Review)(nil)).
		Where("client_id = ?", client.Id).
		Where("state = ?", Entities.ReviewStateDraft).
		Exists(c); err != nil {
		panic(err)
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only 1 review can be in draft at a time"})
		return
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	startDate := time.Now().AddDate(0, -4, 0)
	endDate := time.Now()

	review := &Entities.Review{
		Uid:       uid,
		ClientId:  client.Id,
		State:     Entities.ReviewStateDraft,
		StartDate: &startDate,
		EndDate:   &endDate,
	}

	if _, err := db.NewInsert().Model(review).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Review": review,
	})
}
