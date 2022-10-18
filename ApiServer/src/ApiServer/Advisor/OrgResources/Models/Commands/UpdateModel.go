package Commands

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateModelRequestPath struct {
	ModelId string `binding:"required"`
}

func UpdateModel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

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
		if modified, err = Date.FromCanonical(body.Modified); err != nil {
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

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	var operator = Entities.Operator{}
	if err := db.NewSelect().
		Model(&operator).
		Where("uid = ?", body.OperatorId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var model = Entities.Model{}

	if err := tx.NewSelect().
		Model(&model).
		Relation("File").
		Where("model.uid = ?", path.ModelId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	model.Name = body.Name
	model.OperatorId = operator.Id
	model.WeightedOcfFee = body.WeightedOcfFee
	model.WeightedExAnteFee = body.WeightedExAnteFee
	model.Modified = &modified
	model.FileId = fileId

	// File has been removed or changed; remove old relationship
	if (body.File != nil && model.File != nil && body.File.Uid != model.File.Uid) || (body.File == nil && model.File != nil) {
		if err := auth.RemoveFileFromOrg(session.Org.Uid, model.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}
	if body.File != nil {
		if err := auth.CreateOrgFile(session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if _, err := tx.NewUpdate().Model(&model).Where("uid = ?", path.ModelId).
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

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
