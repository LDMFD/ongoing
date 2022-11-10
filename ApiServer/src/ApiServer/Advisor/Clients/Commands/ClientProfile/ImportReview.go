package ClientProfile

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"time"
)

func ImportReview(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path CreateReviewRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body Entities.ReportReview
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var (
		startDate time.Time
		endDate   time.Time
		err       error
	)
	if startDate, err = time.Parse(time.RFC3339, body.Meta.StartDate); err != nil {
		panic(err)
	}
	if endDate, err = time.Parse(time.RFC3339, body.Meta.EndDate); err != nil {
		panic(err)
	}

	var client *Entities.Client
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		panic(err.Error())
	}

	b, err2 := json.Marshal(body.Report)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err2.Error()})
		panic(err2.Error())
	}
	reportJson := string(b)

	review := &Entities.Review{
		Uid:       body.Id,
		ClientId:  client.Id,
		State:     Entities.ReviewStateFinal,
		StartDate: &startDate,
		EndDate:   &endDate,
		Report:    &reportJson,
	}

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

	if _, err := tx.NewInsert().Model(review).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var report Entities.ReportDetail
	s := bytes.NewBufferString(reportJson)
	if err := json.Unmarshal(s.Bytes(), &report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	for _, f := range report.Funds {
		if f.File != nil {
			if err := auth.CreateFile(&client.Uid, nil, f.File.Uid); err != nil {
				panic(err)
			}
		}
	}
	for _, m := range report.Models {
		if m.File != nil {
			if err := auth.CreateFile(&client.Uid, nil, m.File.Uid); err != nil {
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
