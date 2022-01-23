package Commands

import (
	"fmt"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Errors"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
)

type DeletePolicyProviderRequestPath struct {
	PolicyProviderId int64 `binding:"required"`
}

func DeletePolicyProvider(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyProviderRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyProvider = Entities.PolicyProvider{Id: path.PolicyProviderId}
	if err := db.NewSelect().
		Model(&policyProvider).
		Relation("Policies").
		Relation("Policies.Client").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
		return
	}

	c.JSON(200, gin.H{})
}
