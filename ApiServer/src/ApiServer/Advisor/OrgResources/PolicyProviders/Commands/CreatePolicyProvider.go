package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"strings"

	"github.com/gin-gonic/gin"
)

type CreateOrUpdatePolicyProviderRequest struct {
	Name          string `binding:"required"`
	Pricing       string
	CustomPricing string
}

func CreatePolicyProvider(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateOrUpdatePolicyProviderRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := CreatePolicyProviderInternal(c, session.Org.Id, body)

	c.JSON(200, gin.H{
		"Id": uid,
	})
}

func CreatePolicyProviderInternal(c *gin.Context, orgId int64, body CreateOrUpdatePolicyProviderRequest) string {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := UUID.GenerateUID(c)

	var policyProvider = Entities.PolicyProvider{
		Uid:           uid,
		Name:          strings.TrimSpace(body.Name),
		Pricing:       body.Pricing,
		CustomPricing: body.CustomPricing,
		OrgId:         orgId,
	}
	if _, err := db.NewInsert().Model(&policyProvider).Exec(c); err != nil {
		Errors.HandleError(c, err)
	}
	return uid
}
