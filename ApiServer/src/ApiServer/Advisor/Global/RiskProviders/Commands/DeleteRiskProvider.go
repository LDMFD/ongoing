package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
)

type DeleteRiskProviderRequestPath struct {
	RiskProviderId string `binding:"required"`
}

func DeleteRiskProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteRiskProviderRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskProvider = Entities.RiskProvider{}
	if err := db.NewSelect().
		Model(&riskProvider).
		Relation("Levels").
		Where("uid = ?", path.RiskProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if _, err := db.NewDelete().
		Model(&riskProvider).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
