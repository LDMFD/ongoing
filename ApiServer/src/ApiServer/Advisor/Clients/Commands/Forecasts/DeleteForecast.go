package Forecasts

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"

	"github.com/gin-gonic/gin"
)

type DeleteForecastRequestPath struct {
	ClientId   string `binding:"required"`
	ForecastId string `binding:"required"`
}

func DeleteForecast(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path DeleteForecastRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var forecast = Entities.Forecast{}
	if err := db.NewSelect().
		Model(&forecast).
		Relation("FilePtr.File").
		Where("forecast.uid = ?", path.ForecastId).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			context.Response.Panic(err)
		}
		return
	}
	if forecast.ClientId != client.Id {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			context.Response.Panic(err)
		}
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	ClientDeletion.DeleteForecast(c, &tx, path.ClientId, &forecast)

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
