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

type UpdateFundRequestPath struct {
	FundId string `binding:"required"`
}

func UpdateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path UpdateFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

	var modified time.Time
	var err error
	if body.Modified != "" {
		if modified, err = Date.FromCanonical(body.Modified); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'modified' timestamp"})
			panic(err.Error())
		}
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	var fund = Entities.Fund{}

	if err := tx.NewSelect().
		Model(&fund).
		Relation("File").
		Where("fund.uid = ?", path.FundId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	fund.Name = body.Name
	fund.OcfFee = body.OcfFee
	fund.ExAnteFee = body.ExAnteFee
	fund.Modified = &modified

	// File has been removed or changed; remove old relationship
	if (body.File != nil && fund.File != nil && body.File.Uid != fund.File.Uid) || (body.File == nil && fund.File != nil) {
		if err := auth.RemoveFileFromOrg(&session.Org.Uid, fund.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}
	if body.File != nil {
		if err := auth.CreateFile(nil, &session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	fund.FileId = fileId

	if _, err := tx.NewUpdate().Model(&fund).Where("uid = ?", path.FundId).
		Column("name").
		Column("ocf_fee").
		Column("ex_ante_fee").
		Column("file_id").
		Column("modified").
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
