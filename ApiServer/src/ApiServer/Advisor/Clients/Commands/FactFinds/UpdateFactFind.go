package FactFinds

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"time"

	"github.com/gin-gonic/gin"
)

type UpdateFactFindRequestPath struct {
	ClientId   string `binding:"required"`
	FactFindId string `binding:"required"`
}

func UpdateFactFind(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateFactFindRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFactFindRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var factFind = Entities.FactFind{}
	if err := db.NewSelect().
		Model(&factFind).
		Where("uid = ?", path.FactFindId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if client, err := Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	} else if factFind.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Risk Assessment does not belong to client"})
		panic(err.Error())
	}

	var fileId *int64
	if body.File != nil && body.File.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.File.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			panic(err.Error())
		}
		fileId = &file.Id
	}

	var submitted time.Time
	var err error
	if submitted, err = Date.FromCanonical(body.Submitted); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'submitted' timestamp"})
		panic(err.Error())
	}

	factFind.Submitted = submitted
	factFind.FileId = fileId

	if _, err := db.NewUpdate().
		Model(&factFind).
		WherePK().
		Column("file_id").
		Column("submitted").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"FactFind": factFind,
	})
}
