package Holdings

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Models"

	"github.com/gin-gonic/gin"
)

type CreateHoldingRequestPath struct {
	ClientId int64 `binding:"required"`
}

func CreateHolding(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path CreateHoldingRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var body CreateOrUpdateHoldingRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var holding = Models.Holding{
		ClientId:    path.ClientId,
		PolicyId:    body.PolicyId,
		PortfolioId: body.PortfolioId,
		Proportion:  body.Proportion,
	}
	if _, err := db.NewInsert().Model(&holding).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Holding": holding,
	})
}
