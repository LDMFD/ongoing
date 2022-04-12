package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"
)

type RequestUploadRequest struct {
	Filename string		`binding:"required"`
}

func RequestUpload(c *gin.Context) {
	var req RequestUploadRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	url, fields := GenerateSignedPostPolicy(uid, req.Filename)

	c.JSON(200, gin.H{
		"Url":    url,
		"Fields": fields,
	})
}

type SignalUploadRequest struct {
	Uid      string		`binding:"required"`
	Filename string		`binding:"required"`
	Size     int64		`binding:"required"`
}

func SignalUpload(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var req SignalUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var file = Entities.File{
		Uid:       req.Uid,
		Filename:  req.Filename,
		Size:      req.Size,
	}

	if _, err := db.NewInsert().Model(&file).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
