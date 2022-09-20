package ProviderDiscount

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreateProviderDiscountRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdateProviderDiscountRequestBody struct {
	PolicyProviderId string  `binding:"required"`
	Discount         float64 `binding:"required"`
}

func CreateProviderDiscount(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreateProviderDiscountRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdateProviderDiscountRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		panic(err.Error())
	}

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := UUID.GenerateUID(c)

	var providerDiscount = Entities.ProviderDiscount{
		Uid:              uid,
		ClientId:         client.Id,
		PolicyProviderId: provider.Id,
		Discount:         body.Discount,
	}
	if _, err := db.NewInsert().Model(&providerDiscount).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Id": uid,
	})
}
