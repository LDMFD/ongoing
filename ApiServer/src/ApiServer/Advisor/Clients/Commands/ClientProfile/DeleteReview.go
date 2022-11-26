package ClientProfile

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteReviewRequestPath struct {
	ClientId string `binding:"required"`
	ReviewId string `binding:"required"`
}

func DeleteReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

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

	if _, err := tx.NewDelete().
		Model(&review).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	clientSpec := GetClientInternal(c, client)
	for _, review := range clientSpec.Reviews {
		if review.Id != path.ReviewId {
			continue
		}
		for _, fund := range review.Report.Funds {
			if fund.File == nil {
				continue
			}
			if err := auth.RemoveFileFromClientOnly(client.Uid, fund.File.Uid); err != nil {
				panic(err)
			}
		}
		for _, model := range review.Report.Models {
			if model.File == nil {
				continue
			}
			if err := auth.RemoveFileFromClientOnly(client.Uid, model.File.Uid); err != nil {
				panic(err)
			}
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
