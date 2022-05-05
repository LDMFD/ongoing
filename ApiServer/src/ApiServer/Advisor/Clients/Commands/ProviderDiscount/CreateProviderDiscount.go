package ProviderDiscount

import (
	"github.com/google/uuid"
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

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

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

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
	c.JSON(200, gin.H{})
}
