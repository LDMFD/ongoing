package RiskAssessments

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateRiskAssessmentRequestPath struct {
	ClientId         string `binding:"required"`
	RiskAssessmentId string `binding:"required"`
}

func UpdateRiskAssessment(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path UpdateRiskAssessmentRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateRiskAssessmentRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var assessment = Entities.RiskAssessment{}
	if err := db.NewSelect().
		Model(&assessment).
		Relation("FilePtr.File").
		Where("risk_assessment.uid = ?", path.RiskAssessmentId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	if assessment.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Risk Assessment does not belong to client"})
		return
	}

	var provider = Entities.RiskProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.RiskProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var level = Entities.RiskLevel{}
	if err := db.NewSelect().
		Model(&level).
		Where("uid = ?", body.RiskLevelId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if level.RiskProviderId != provider.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.LevelDoesNotBelongToProvider})
		panic(Errors.LevelDoesNotBelongToProvider)
	}

	var completed time.Time
	if completed, err = Date.FromCanonical(body.Completed); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'completed' timestamp"})
		panic(err.Error())
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}
	defer tx.Rollback()

	// FilePtr has been removed or changed; remove old relationship
	if (body.File != nil && assessment.FilePtr != nil && body.File.Uid != assessment.FilePtr.File.Uid) ||
		(body.File == nil && assessment.FilePtr != nil) {
		ctx := c.Request.Context()
		if err := auth.RemoveFileFromClientAndOrg(&ctx, &tx, client.Uid, session.Org.Uid, assessment.FilePtr.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		Helpers.DeleteFile(c, tx, *assessment.FilePtr)
	}
	if body.File != nil {
		ctx := c.Request.Context()
		if err := auth.CreateOrgFile(&ctx, &tx, session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		assessment.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	assessment.RiskLevelId = level.Id
	assessment.Completed = completed

	if _, err := tx.NewUpdate().
		Model(&assessment).
		WherePK().
		Column("risk_level_id").
		Column("completed").
		Column("file_ptr_id").
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
