package RiskAssessments

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteRiskAssessmentRequestPath struct {
	ClientId         string `binding:"required"`
	RiskAssessmentId string `binding:"required"`
}

func DeleteRiskAssessment(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteRiskAssessmentRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
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

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	if assessment.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "RiskAssessment does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&assessment).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
