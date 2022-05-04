package Commands

import (
	"net/http"
	"ongoing/Entities"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateModelRequestPath struct {
	ModelId string `binding:"required"`
}

func UpdateModel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateModelRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateModelRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var modified time.Time
	var err error
	if body.Modified != "" {
		if modified, err = time.Parse("2006-01-02", body.Modified); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'modified' timestamp"})
			return
		}
	}

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

	var operator = Entities.Operator{}
	if err := db.NewSelect().
		Model(&operator).
		Where("uid = ?", body.OperatorId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var model = Entities.Model{
		Name:              body.Name,
		OperatorId:        operator.Id,
		WeightedOcfFee:    body.WeightedOcfFee,
		WeightedExAnteFee: body.WeightedExAnteFee,
		Modified:          &modified,
		FileId:            fileId,
	}
	if _, err := db.NewUpdate().Model(&model).Where("uid = ?", path.ModelId).
		Column("name").
		Column("operator_id").
		Column("weighted_ocf_fee").
		Column("weighted_ex_ante_fee").
		Column("modified").
		Column("file_id").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"Model": model,
	})
}
