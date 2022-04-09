package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type UpdateProviderChargePath struct {
	ProviderChargeId string `binding:"required"`
}

type UpdateProviderChargeBody struct {
	Desc   string  `binding:"required"`
	Charge float64 `binding:"required"`
}

func UpdateProviderCharge(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

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

	var providerCharge = Entities.ProviderCharge{
		Desc:   body.Desc,
		Charge: body.Charge,
	}
	if _, err := db.NewUpdate().
		Model(&providerCharge).
		Where("uid = ?", path.ProviderChargeId).
		Column("desc").
		Column("charge").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
