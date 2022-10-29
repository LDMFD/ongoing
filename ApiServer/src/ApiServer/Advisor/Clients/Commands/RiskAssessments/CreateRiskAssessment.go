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
	"ongoing/Utils/UUID"
	"time"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type CreateRiskAssessmentRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdateRiskAssessmentRequestBody struct {
	RiskProviderId string `binding:"required"`
	RiskLevelId    string `binding:"required"`
	Questionnaire  *Entities.RequestFile
	Completed      string
}

func CreateRiskAssessment(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path CreateRiskAssessmentRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateRiskAssessmentRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
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
		return
	}

	uid := UUID.GenerateUID(c)

	var assessment = Entities.RiskAssessment{
		Uid:         uid,
		ClientId:    client.Id,
		RiskLevelId: level.Id,
		Completed:   completed,
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	assessment.FilePtrId = Helpers.CreateFileRef(c, tx, body.Questionnaire)

	if _, err := tx.NewInsert().Model(&assessment).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if err := auth.CreateClientFile(client.Uid, session.Org.Uid, body.Questionnaire.Uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
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
