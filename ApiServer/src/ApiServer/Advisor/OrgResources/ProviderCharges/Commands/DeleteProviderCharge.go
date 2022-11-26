package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"
)

type DeleteProviderChargeRequestPath struct {
	ProviderChargeId string `binding:"required"`
}

func DeleteProviderCharge(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path DeleteProviderChargeRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var providerCharge = Entities.ProviderCharge{}
	if err := db.NewSelect().
		Model(&providerCharge).
		Relation("PolicyProvider").
		Where("provider_charge.uid = ?", path.ProviderChargeId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if providerCharge.PolicyProvider.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	if _, err := db.NewDelete().
		Model(&providerCharge).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
