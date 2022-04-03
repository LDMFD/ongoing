package Commands

import (
	"fmt"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
)

type DeletePolicyProviderRequestPath struct {
	PolicyProviderId string `binding:"required"`
}

func DeletePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyProviderRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyProvider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&policyProvider).
		Relation("Policies").
		Relation("Policies.Client").
		Where("uid = ?", path.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if len(policyProvider.Policies) > 0 {
		var names []string
		for _, p := range policyProvider.Policies {
			s := fmt.Sprintf("%v (in use by %v, %v)", p.ExternalId, p.Client.Forenames, p.Client.Surname)
			names = append(names, s)
		}
		s := fmt.Sprintln(strings.Join(names[:], ", "))
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.PolicyProviderHasDependentPolicies(s)})
		return
	}

	if _, err := db.NewDelete().
		Model(&policyProvider).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
