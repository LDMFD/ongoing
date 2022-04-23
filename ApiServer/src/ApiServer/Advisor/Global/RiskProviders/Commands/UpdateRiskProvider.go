package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateRiskProviderPath struct {
	RiskProviderId string `binding:"required"`
}

type UpdateRiskProviderRequest struct {
	Name string `binding:"required"`
}

func UpdateRiskProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateRiskProviderPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var req UpdateRiskProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskProvider = Entities.RiskProvider{
		Name:    req.Name,
	}
	if _, err := db.NewUpdate().Model(&riskProvider).Where("uid = ?", path.RiskProviderId).
		Column("name").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"RiskProvider": riskProvider,
	})
}
