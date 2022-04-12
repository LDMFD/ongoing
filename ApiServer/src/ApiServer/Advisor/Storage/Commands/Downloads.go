package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type RequestDownloadRequest struct {
	Uid      string		`binding:"required"`
}

func RequestDownload(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var req RequestDownloadRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var file = Entities.File{}
	if err := db.NewSelect().Model(&file).Where("uid = ?", req.Uid).Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	url := GenerateSignedGetUrl(file.Uid)

	c.JSON(200, gin.H{
		"Url": url,
	})
}

