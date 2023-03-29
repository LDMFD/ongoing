package Commands

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
	"ongoing/Utils/Date"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type UpdateFundRequestPath struct {
	FundId string `binding:"required"`
}

func UpdateFund(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	var path UpdateFundRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		context.Response.InvalidInput()
		return
	}

	var modified time.Time
	var err error
	if modified, err = Date.FromCanonical(body.Modified); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'modified' timestamp"})
		panic(err.Error())
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	var fund = Entities.Fund{}

	if err := tx.NewSelect().
		Model(&fund).
		Relation("FilePtr.File").
		Where("fund.uid = ?", path.FundId).
		Where("fund.org_id = ?", context.Session.Org.Id).
		Scan(c); err != nil {
		context.Response.NotFound()
		return
	}

	fund.Name = strings.TrimSpace(body.Name)
	fund.OcfFee = body.OcfFee
	fund.ExAnteFee = body.ExAnteFee
	fund.Modified = &modified
	fund.FilePtrId = nil

	// FilePtr has been removed or changed; remove old relationship
	if (body.File != nil && fund.FilePtr != nil && body.File.Uid != fund.FilePtr.File.Uid) || (body.File == nil && fund.FilePtr != nil) {
		ctx := c.Request.Context()
		if err := context.Auth.RemoveFileFromOrg(&ctx, &tx, context.Session.Org.Uid, fund.FilePtr.File.Uid); err != nil {
			context.Panic(err)
		}
		Helpers.DeleteFile(c, tx, *fund.FilePtr)
	}
	if body.File != nil {
		ctx := c.Request.Context()
		if err := context.Auth.CreateOrgFile(&ctx, &tx, context.Session.Org.Uid, body.File.Uid); err != nil {
			context.Panic(err)
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
		context.Panic(err)
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	c.Status(http.StatusOK)
}
