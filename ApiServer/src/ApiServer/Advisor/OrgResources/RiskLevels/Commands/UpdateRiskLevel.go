package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

type UpdateRiskLevelPath struct {
	RiskLevelId string `binding:"required"`
}

type UpdateRiskLevelBody struct {
	Level int64  `binding:"required"`
	Label string `binding:"required"`
	Desc  string `binding:"required"`
}

func UpdateRiskLevel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateRiskLevelPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body UpdateRiskLevelBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskLevel = Entities.RiskLevel{
		Level:  body.Level,
		Label:  body.Label,
		Desc:   body.Desc,
	}
	if _, err := db.NewUpdate().
		Model(&riskLevel).
		Where("uid = ?", path.RiskLevelId).
		Column("level").
		Column("label").
		Column("desc").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
