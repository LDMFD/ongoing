package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateProviderChargeRequest struct {
	Desc string `binding:"required"`
	Charge float64 `binding:"required"`
	ProviderId string `binding:"required"`
}

func CreateProviderCharge(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body CreateProviderChargeRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.ProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var providerCharge = Entities.ProviderCharge{
		Uid:        uid,
		Desc:       body.Desc,
		Charge:     body.Charge,
		ProviderId: provider.Id,
	}
	if _, err := db.NewInsert().Model(&providerCharge).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"ProviderCharge": providerCharge,
	})
}
