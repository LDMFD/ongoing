package Commands

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
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
		Relation("FilePtr.File").
		Where("fund.uid = ?", path.FundId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	fund.Name = body.Name
	fund.OcfFee = body.OcfFee
	fund.ExAnteFee = body.ExAnteFee
	fund.Modified = &modified
	fund.FilePtrId = nil

	// FilePtr has been removed or changed; remove old relationship
	if (body.File != nil && fund.FilePtr != nil && body.File.Uid != fund.FilePtr.File.Uid) || (body.File == nil && fund.FilePtr != nil) {
		if err := auth.RemoveFileFromOrg(session.Org.Uid, fund.FilePtr.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		Helpers.DeleteFile(c, tx, *fund.FilePtr)
	}
	if body.File != nil {
		if err := auth.CreateOrgFile(session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		fund.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	if _, err := tx.NewUpdate().Model(&fund).Where("uid = ?", path.FundId).
		Column("name").
		Column("ocf_fee").
		Column("ex_ante_fee").
		Column("file_ptr_id").
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
