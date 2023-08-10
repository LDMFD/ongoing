package Commands

import (
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Config"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyProviderPath struct {
	PolicyProviderId string `binding:"required"`
}

func UpdatePolicyProvider(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdatePolicyProviderPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyProviderRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	UpdatePolicyProviderInternal(c, session.Org.Id, path.PolicyProviderId, body)

	c.Status(http.StatusOK)
}

func UpdatePolicyProviderInternal(c *gin.Context, orgId int64, providerId string, body CreateOrUpdatePolicyProviderRequest) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var policyProvider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&policyProvider).
		Where("uid = ?", providerId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	if policyProvider.OrgId != orgId {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	policyProvider.Name = strings.TrimSpace(body.Name)
	policyProvider.Pricing = body.Pricing
	policyProvider.CustomPricing = body.CustomPricing

	if _, err := db.NewUpdate().Model(&policyProvider).
		Where("org_id = ?", session.Org.Id).
		Where("uid = ?", providerId).
		Column("name").
		Column("pricing").
		Column("custom_pricing").
		Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}
}
