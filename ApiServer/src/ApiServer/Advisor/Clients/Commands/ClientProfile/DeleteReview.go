package ClientProfile

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
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

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer tx.Rollback()

	var review = Entities.Review{}
	if err := tx.NewSelect().
		Model(&review).
		Where("uid = ?", path.ReviewId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err.Error())
		}
		return
	}

	if review.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review does not belong to client"})
		return
	}

	clientSpec, _ := GetClientInternal(c, client)
	for _, review := range clientSpec.Reviews {
		if review.Id != path.ReviewId {
			continue
		}
		ClientDeletion.DeleteReview(c, &tx, client, &review)
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
