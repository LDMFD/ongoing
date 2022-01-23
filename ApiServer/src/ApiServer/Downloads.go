package ApiServer

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"ongoing/Entities"
)

type RequestDownloadRequest struct {
	Uid      string		`binding:"required"`
}

func (s *ApiServer) requestDownload(c *gin.Context) {
	var req RequestDownloadRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var file = Entities.File{}
	if err := s.db.NewSelect().Model(&file).Where("uid = ?", req.Uid).Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := GenerateSignedGetUrl("/Users/darren/dev/p/ongoing/Config/Storage/Credentials/Storage.pem", "ongoing-test-docs", file.Uid)

	c.JSON(200, gin.H{
		"Url": url,
	})
}

