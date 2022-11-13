package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreateOrUpdatePolicyProviderRequest struct {
	Name          string `binding:"required"`
	Pricing       string
	CustomPricing string
}

func CreatePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var req CreateOrUpdatePolicyProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := UUID.GenerateUID(c)

	var policyProvider = Entities.PolicyProvider{
		Uid:           uid,
		Name:          req.Name,
		Pricing:       req.Pricing,
		CustomPricing: req.CustomPricing,
		OrgId:         session.Org.Id,
	}
	if _, err := db.NewInsert().Model(&policyProvider).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Id": uid,
	})
}
