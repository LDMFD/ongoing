package FactFinds

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateFactFindRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdateFactFindRequestBody struct {
	File      *Entities.RequestFile
	Submitted string
}

func CreateFactFind(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreateFactFindRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFactFindRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	var fileId *int64
	if body.File != nil && body.File.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.File.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		fileId = &file.Id
	}

	var submitted time.Time
	var err error
	if submitted, err = time.Parse("2006-01-02", body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		return
	}

	var factFind = Entities.FactFind{
		Uid:       uid,
		ClientId:  client.Id,
		FileId:    fileId,
		Submitted: submitted,
	}
	if _, err := db.NewInsert().Model(&factFind).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"FactFind": factFind,
	})
}
