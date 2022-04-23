package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type GetRiskProviderPath struct {
	RiskProviderId string `binding:"required"`
}

func GetRiskProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path GetRiskProviderPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskProvider = Entities.RiskProvider{}
	if err := db.NewSelect().
		Model(&riskProvider).
		Where("uid = ?", path.RiskProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"RiskProvider": riskProvider,
	})
}
