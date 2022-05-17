package Forecasts

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"time"

	"github.com/gin-gonic/gin"
)

type UpdateForecastRequestPath struct {
	ClientId   string `binding:"required"`
	ForecastId string `binding:"required"`
}

func UpdateForecast(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateForecastRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateForecastRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var forecast = Entities.Forecast{}
	if err := db.NewSelect().
		Model(&forecast).
		Where("uid = ?", path.ForecastId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)
	if forecast.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Risk Assessment does not belong to client"})
		return
	}

	var fileId *int64
	if body.File != nil && body.File.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.File.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		fileId = &file.Id
	}

	var submitted time.Time
	var err error
	if submitted, err = time.Parse("2006-01-02", body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		return
	}

	forecast.Submitted = submitted
	forecast.FileId = fileId

	if _, err := db.NewUpdate().
		Model(&forecast).
		WherePK().
		Column("file_id").
		Column("submitted").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Forecast": forecast,
	})
}
