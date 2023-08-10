package Commands

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"ongoing/Utils/UUID"
	"strings"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type CreateOrUpdateFundRequestBody struct {
	Name      string `binding:"required"`
	OcfFee    float64
	ExAnteFee float64
	Modified  string `binding:"required"`
	File      *Entities.RequestFile
}

func CreateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

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
	} else {
		modified = time.Now()
	}

	uid := UUID.GenerateUID(c)

	var fund = Entities.Fund{
		Uid:       uid,
		Name:      strings.TrimSpace(body.Name),
		OcfFee:    body.OcfFee,
		ExAnteFee: body.ExAnteFee,
		Modified:  &modified,
		OrgId:     session.Org.Id,
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer tx.Rollback()

	if body.File != nil {
		fund.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	if _, err := tx.NewInsert().Model(&fund).Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}

	if body.File != nil {
		ctx := c.Request.Context()
		if err := auth.CreateOrgFile(&ctx, &tx, session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{
		"Id": uid,
	})
}
