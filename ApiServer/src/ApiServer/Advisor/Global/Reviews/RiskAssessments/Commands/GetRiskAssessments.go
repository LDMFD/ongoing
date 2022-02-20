package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetRiskAssessments(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var riskAssessments []Entities.RiskAssessment
	if err := db.NewSelect().
		Model(&riskAssessments).
		//OrderExpr("label ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"RiskAssessments": riskAssessments,
	})
}
