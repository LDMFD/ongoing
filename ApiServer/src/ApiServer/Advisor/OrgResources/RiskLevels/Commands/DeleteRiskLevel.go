package Commands

import (
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

type DeleteRiskLevelRequestPath struct {
	RiskLevelId string `binding:"required"`
}

func DeleteRiskLevel(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path DeleteRiskLevelRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskLevel = Entities.RiskLevel{}
	if err := db.NewSelect().
		Model(&riskLevel).
		Relation("RiskProvider").
		Where("risk_level.uid = ?", path.RiskLevelId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if riskLevel.RiskProvider.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
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
