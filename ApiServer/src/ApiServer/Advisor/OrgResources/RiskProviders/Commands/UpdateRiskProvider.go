package Commands

import (
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Config"
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
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

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

	var riskProvider = Entities.RiskProvider{}
	if err := db.NewSelect().
		Model(&riskProvider).
		Where("uid = ?", path.RiskProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if riskProvider.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	riskProvider.Name = req.Name

	if _, err := db.NewUpdate().Model(&riskProvider).Where("uid = ?", path.RiskProviderId).
		Column("name").
		Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}

	c.JSON(200, gin.H{
		"RiskProvider": riskProvider,
	})
}
