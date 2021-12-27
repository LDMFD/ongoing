package ApiServer

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"ongoing/Models"
	"strings"
)

type CreateReviewUri struct {
	ClientId int64 `binding:"required"`
}

func (s *ApiServer) createReview(c *gin.Context) {
	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var query CreateReviewUri
	if err := c.ShouldBindUri(&query); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var review = Models.Review{
		ClientId: query.ClientId,
		State: "DRAFT",
		Uid: uid,
	}
	if _, err := s.db.NewInsert().Model(&review).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Review": review,
	})
}
