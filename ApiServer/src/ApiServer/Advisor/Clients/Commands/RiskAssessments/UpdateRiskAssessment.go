package RiskAssessments

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
		Relation("Questionnaire").
		Where("risk_assessment.uid = ?", path.RiskAssessmentId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
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

	var questionnaireFileId *int64
	if body.Questionnaire != nil && body.Questionnaire.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.Questionnaire.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			panic(err.Error())
		}
		questionnaireFileId = &file.Id
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

	// File has been removed or changed; remove old relationship
	if (body.Questionnaire != nil && assessment.Questionnaire != nil && body.Questionnaire.Uid != assessment.Questionnaire.Uid) ||
		(body.Questionnaire == nil && assessment.Questionnaire != nil) {
		if err := auth.RemoveFileFromClientAndOrg(client.Uid, session.Org.Uid, assessment.Questionnaire.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}
	if body.Questionnaire != nil {
		if err := auth.CreateOrgFile(session.Org.Uid, body.Questionnaire.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	assessment.RiskLevelId = level.Id
	assessment.Completed = completed
	assessment.QuestionnaireFileId = questionnaireFileId

	if _, err := tx.NewUpdate().
		Model(&assessment).
		WherePK().
		Column("risk_level_id").
		Column("completed").
		Column("questionnaire_file_id").
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
