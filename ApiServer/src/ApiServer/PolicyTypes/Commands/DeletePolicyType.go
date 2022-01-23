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

type DeletePolicyTypeRequestPath struct {
	PolicyTypeId int64 `binding:"required"`
}

func DeletePolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeletePolicyTypeRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var policyType = Entities.PolicyType{Id: path.PolicyTypeId}
	if err := db.NewSelect().
		Model(&policyType).
		Relation("Policies").
		Relation("Policies.Client").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(policyType.Policies) > 0 {
		var names []string
		for _, p := range policyType.Policies {
			s := fmt.Sprintf("%v (in use by %v, %v)", p.ExternalId, p.Client.Forenames, p.Client.Surname)
			names = append(names, s)
		}
		s := fmt.Sprintln(strings.Join(names[:], ", "))
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.PolicyTypeHasDependentPolicies(s)})
		return
	}

	if _, err := db.NewDelete().
		Model(&policyType).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{})
}
