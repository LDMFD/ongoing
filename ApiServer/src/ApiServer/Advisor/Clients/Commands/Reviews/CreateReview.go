package Reviews

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile/Reports"
	"ongoing/Entities"
	"strings"
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

	// Only 1 review in draft state at once
	if exists, err := db.NewSelect().Model((*Entities.Review)(nil)).Where("state != ?", Entities.ReviewStateFinal).Exists(c); err != nil {
		panic(err)
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only 1 review can be in draft at a time"})
		return
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	report := Reports.GenerateReport(c, client.Id)

	b, err := json.Marshal(report)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	reportJson := string(b)

	review := &Entities.Review{
		Uid:      uid,
		ClientId: client.Id,
		State:    Entities.ReviewStateDraft,
		Report:   &reportJson,
	}

	if _, err := db.NewInsert().Model(review).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Review": review,
	})
}
