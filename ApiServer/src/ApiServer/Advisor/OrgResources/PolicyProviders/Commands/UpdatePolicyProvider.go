package Commands

import (
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyProviderPath struct {
	PolicyProviderId string `binding:"required"`
}

func UpdatePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdatePolicyProviderPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var req CreateOrUpdatePolicyProviderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyProvider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&policyProvider).
		Where("uid = ?", path.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	if policyProvider.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	policyProvider.Name = req.Name
	policyProvider.Pricing = req.Pricing
	policyProvider.CustomPricing = req.CustomPricing

	if _, err := db.NewUpdate().Model(&policyProvider).
		Where("org_id = ?", session.Org.Id).
		Where("uid = ?", path.PolicyProviderId).
		Column("name").
		Column("pricing").
		Column("custom_pricing").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyProvider": policyProvider,
	})
}
