package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateRiskAssessmentRequestBody struct {
	Label string `binding:"required"`
	Text  string `binding:"required"`
}

func CreateRiskAssessment(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var body CreateOrUpdateRiskAssessmentRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskAssessment = Entities.RiskAssessment{
		//Label: body.Label,
		//Text:  body.Text,
	}
	if _, err := db.NewInsert().Model(&riskAssessment).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"RiskAssessments": riskAssessment,
	})
}
