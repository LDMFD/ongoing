package Commands

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"os"
)

type RequestUploadRequestBody struct {
	Filename string `binding:"required"`
}

func RequestUpload(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	if session.Role == Entities.UserTypeClient {
		log.Println("Unauthorized attempt to upload file:", session.Email)
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	var req RequestUploadRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := UUID.GenerateUIDWithKey(c, "file")

	url, fields := GenerateSignedPostPolicy(uid, req.Filename)

	c.JSON(200, gin.H{
		"Url":    url,
		"Fields": fields,
	})
}

type SignalUploadRequest struct {
	Uid      string `binding:"required"`
	Filename string `binding:"required"`
	Size     int64  `binding:"required"`
}

func SignalUpload(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	if session.Role == Entities.UserTypeClient {
		log.Println("Unauthorized attempt to signal file upload:", session.Email)
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	var req SignalUploadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if os.Getenv("OFFLINE_TESTS") != "true" {
		// Check the object exists
		url := GenerateSignedGetUrl(req.Uid)
		resp, err := http.Head(url)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "file not found"})
			panic(err.Error())
		}
		if resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("file %v (\"%v\") not found (status=%v)", req.Uid, req.Filename, resp.StatusCode)})
			panic(err.Error())
		}

		if resp.Header["Content-Length"][0] != fmt.Sprintf("%v", req.Size) {
			c.AbortWithError(http.StatusBadRequest, errors.New("file size mismatch"))
		}
	}

	var file = Entities.File{
		Uid:      req.Uid,
		Filename: req.Filename,
		Size:     req.Size,
	}

	if _, err := db.NewInsert().Model(&file).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
