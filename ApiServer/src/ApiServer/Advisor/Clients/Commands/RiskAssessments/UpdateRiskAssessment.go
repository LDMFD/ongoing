package RiskAssessments

import (
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
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
		Where("uid = ?", path.RiskAssessmentId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)
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
			return
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			return
		}
		questionnaireFileId = &file.Id
	}

	var completed time.Time
	var err error
	if completed, err = time.Parse("2006-01-02", body.Completed); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Couldn't parse 'completed' timestamp"})
		return
	}

	assessment.RiskLevelId = level.Id
	assessment.Completed = completed
	assessment.QuestionnaireFileId = questionnaireFileId

	if _, err := db.NewUpdate().
		Model(&assessment).
		WherePK().
		Column("risk_level_id").
		Column("completed").
		Column("questionnaire_file_id").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"RiskAssessment": assessment,
	})
}
