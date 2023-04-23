package ProviderDiscount

import (
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateProviderDiscountRequestPath struct {
	ClientId           string `binding:"required"`
	ProviderDiscountId string `binding:"required"`
}

func UpdateProviderDiscount(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateProviderDiscountRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateProviderDiscountRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var providerDiscount = Entities.ProviderDiscount{}
	if err := db.NewSelect().
		Model(&providerDiscount).
		Where("uid = ?", path.ProviderDiscountId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	if providerDiscount.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Provider Discount does not belong to client"})
		return
	}

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	providerDiscount.Discount = body.Discount
	providerDiscount.PolicyProviderId = provider.Id

	if _, err := db.NewUpdate().
		Model(&providerDiscount).
		WherePK().
		Column("policy_provider_id").
		Column("discount").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
