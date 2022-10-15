package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

type DeleteRiskLevelRequestPath struct {
	RiskLevelId string `binding:"required"`
}

func DeleteRiskLevel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteRiskLevelRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskLevel = Entities.RiskLevel{}
	if err := db.NewSelect().
		Model(&riskLevel).
		Where("uid = ?", path.RiskLevelId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if _, err := db.NewDelete().
		Model(&riskLevel).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
