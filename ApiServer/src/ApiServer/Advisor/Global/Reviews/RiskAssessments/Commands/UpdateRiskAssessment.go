package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateRiskAssessmentRequestPath struct {
	RiskAssessmentId int64 `binding:"required"`
}

func UpdateRiskAssessment(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateRiskAssessmentRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdateRiskAssessmentRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var riskAssessment = Entities.RiskAssessment{
		Id:    path.RiskAssessmentId,
		//Label: body.Label,
		//Text:  body.Text,
	}
	if _, err := db.NewUpdate().Model(&riskAssessment).WherePK().
		Column("label").
		Column("text").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"RiskAssessments": riskAssessment,
	})
}
