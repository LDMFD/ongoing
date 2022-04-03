package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteRiskAssessmentRequestPath struct {
	RiskAssessmentId string `binding:"required"`
}

func DeleteRiskAssessment(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteRiskAssessmentRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskAssessment = Entities.RiskAssessment{}
	//if err := db.NewSelect().
	//	Model(&riskAssessment).
	//	Where("uid = ", path.RiskAssessmentId).
	//	Scan(c); err != nil {
	//	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	//	panic(err.Error())
	//}

	if _, err := db.NewDelete().
		Model(&riskAssessment).
		Where("uid = ?", path.RiskAssessmentId).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
