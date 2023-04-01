package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteForecast(c *gin.Context, tx *bun.Tx, clientId string, forecast *Entities.Forecast) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().
		Model(forecast).
		WherePK().
		Exec(c); err != nil {
		context.Panic(err)
	}

	if forecast.FilePtr != nil {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromClientAndOrg(&ctx, tx, clientId, context.Session.Org.Uid, forecast.FilePtr.File.Uid); err != nil {
			context.Panic(err)
		}
		Helpers.DeleteFile(c, *tx, *forecast.FilePtr)
	}
}
