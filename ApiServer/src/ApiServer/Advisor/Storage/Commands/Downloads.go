package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"
)

type RequestDownloadRequest struct {
	Uid string `binding:"required"`
}

func RequestDownload(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var req RequestDownloadRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if ok, err := auth.CheckFilePermission(req.Uid, "read", session.UserUid); err != nil || !ok {
		c.AbortWithStatus(http.StatusForbidden)
		if err != nil {
			panic(err.Error())
		}
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
