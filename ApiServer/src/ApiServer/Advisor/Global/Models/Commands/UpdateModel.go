package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateModelRequestPath struct {
	ModelId int64 `binding:"required"`
}

func UpdateModel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateModelRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdateModelRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var fileId *int64
	if body.FileUid != nil {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", *body.FileUid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		fileId = &file.Id
	}

	var model = Entities.Model{
		Id:          path.ModelId,
		Name:        body.Name,
		OperatorId:  body.OperatorId,
		WeightedFee: body.WeightedFee,
		ExAnteFee:   body.ExAnteFee,
		FileId:      fileId,
	}
	if _, err := db.NewUpdate().Model(&model).WherePK().
		Column("name").
		Column("operator_id").
		Column("weighted_ocf").
		Column("ex_ante_fee").
		Column("file_id").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"Model": model,
	})
}
