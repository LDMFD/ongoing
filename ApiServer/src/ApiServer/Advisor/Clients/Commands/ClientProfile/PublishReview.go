package ClientProfile

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Operators/Reviews"
	"time"
)

func PublishReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateOrPublishReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	var review = Entities.Review{}
	if err := db.NewSelect().
		Model(&review).
		Where("state = ?", Entities.ReviewStateDraft).
		Where("uid = ?", path.ReviewId).
		Where("client_id = ?", client.Id).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if review.StartDate == nil || review.EndDate == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review start or end dates not set"})
		return
	}
	if review.StartDate.After(*review.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Review start dates is after end date"})
		return
	}

	// Begin transaction
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered: ", r)
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}()

	report, _ := GenerateReport(c, &tx, client.Id, true)
	if report == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
	}
	report.Id = review.Uid

	b, err2 := json.Marshal(report)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err2.Error()})
		panic(err2.Error())
	}
	reportJson := string(b)

	review.Report = &reportJson
	review.State = Entities.ReviewStateFinal
	review.FinalizedDate = time.Now()

	if _, err := tx.NewUpdate().
		Model(&review).
		WherePK().
		Column("report").
		Column("state").
		Column("finalized_date").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	Reviews.CreateReview(c, tx, client.Uid)

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
