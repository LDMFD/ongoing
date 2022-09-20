package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreateRiskLevelRequest struct {
	RiskProviderId string `binding:"required"`
	Level          int64  `binding:"required"`
	Label          string `binding:"required"`
	Desc           string `binding:"required"`
}

func CreateRiskLevel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body CreateRiskLevelRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

	uid := UUID.GenerateUID(c)

	var riskLevel = Entities.RiskLevel{
		Uid:            uid,
		RiskProviderId: provider.Id,
		Level:          body.Level,
		Label:          body.Label,
		Desc:           body.Desc,
	}
	if _, err := db.NewInsert().Model(&riskLevel).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Id": uid,
	})
}
