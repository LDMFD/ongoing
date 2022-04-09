package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type DeleteProviderChargeRequestPath struct {
	ProviderChargeId string `binding:"required"`
}

func DeleteProviderCharge(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteProviderChargeRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var providerCharge = Entities.ProviderCharge{}
	if err := db.NewSelect().
		Model(&providerCharge).
		Where("uid = ?", path.ProviderChargeId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
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
