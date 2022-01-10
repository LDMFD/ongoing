package ApiServer

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"ongoing/Models"
	"strings"
)

type RequestUploadRequest struct {
	Filename string		`binding:"required"`
}

func (s *ApiServer) requestUpload(c *gin.Context) {
	var req RequestUploadRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	url, fields := GenerateSignedPostPolicy("/Users/darren/dev/p/ongoing/Config/Storage/Credentials/Storage.pem",
		"ongoing-test-docs", uid, req.Filename)

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

func (s *ApiServer) signalUpload(c *gin.Context) {
	var req SignalUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var file = Models.File{
		Uid:       req.Uid,
		Filename:  req.Filename,
		Size:      req.Size,
	}

	if _, err := s.db.NewInsert().Model(&file).Exec(c); err != nil {
		panic(err)
	}
}
