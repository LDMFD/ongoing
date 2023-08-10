package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Config"
	"ongoing/Entities"
)

type UpdateProviderChargePath struct {
	ProviderChargeId string `binding:"required"`
}

type UpdateProviderChargeBody struct {
	Boundary float64
	Charge   float64
}

func UpdateProviderCharge(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdateProviderChargePath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body UpdateProviderChargeBody
	if err := c.ShouldBindJSON(&body); err != nil {
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

	providerCharge.Boundary = body.Boundary
	providerCharge.Charge = body.Charge

	if _, err := db.NewUpdate().
		Model(&providerCharge).
		Where("uid = ?", path.ProviderChargeId).
		Column("boundary").
		Column("charge").
		Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}

	c.JSON(200, gin.H{})
}
