package Forecasts

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteForecastRequestPath struct {
	ClientId   string `binding:"required"`
	ForecastId string `binding:"required"`
}

func DeleteForecast(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteForecastRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Forecast does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&forecast).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
