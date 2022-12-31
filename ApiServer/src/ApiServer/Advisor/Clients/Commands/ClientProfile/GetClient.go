package ClientProfile

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
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
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetClientRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		// TODO implement levelled logging, so this stacktrace can be printed as a warning
		//panic(err.Error())
		return
	}

	c.JSON(200, GetClientInternal(c, client))
}
