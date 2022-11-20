package Commands

import (
	"fmt"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Config"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
)

type DeletePolicyTypeRequestPath struct {
	PolicyTypeId string `binding:"required"`
}

func DeletePolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path DeletePolicyTypeRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyType = Entities.PolicyType{}
	if err := db.NewSelect().
		Model(&policyType).
		Relation("Policies.Client.User").
		Where("uid = ?", path.PolicyTypeId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if policyType.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	if len(policyType.Policies) > 0 {
		var names []string
		for _, p := range policyType.Policies {
			s := fmt.Sprintf("%v (in use by %v, %v)", p.ExternalId, p.Client.User.Forenames, p.Client.User.Surname)
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
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
