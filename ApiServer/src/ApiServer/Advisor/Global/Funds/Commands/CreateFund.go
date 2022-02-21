package Commands

import (
	"net/http"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateOrUpdateFundRequestBody struct {
	Name      string  `binding:"required"`
	OcfFee    float64 `binding:"required"`
	ExAnteFee float64 `binding:"required"`
}

func CreateFund(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var body CreateOrUpdateFundRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var fund = Entities.Fund{
		Name:      body.Name,
		OcfFee:    body.OcfFee,
		ExAnteFee: body.ExAnteFee,
	}
	if _, err := db.NewInsert().Model(&fund).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"Fund": fund,
	})
}
