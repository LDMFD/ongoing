package ClientProfile

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

type GetClientRequestPath struct {
	ClientId string `binding:"required"`
}

type GetClientResponse struct {
	Metadata Entities.ClientReport
	Draft    *Entities.Draft
	Report   Entities.ReportDetail
	Reviews  []Entities.ReportReview
}

func GetClient(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		context.Response.NotFound()
		return
	}

	res, _ := GetClientInternal(c, client)

	c.JSON(200, res)
}
