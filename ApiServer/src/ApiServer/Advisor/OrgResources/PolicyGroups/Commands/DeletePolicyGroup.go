package Commands

import (
	"fmt"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"
	"strings"

	"github.com/gin-gonic/gin"
)

type DeletePolicyGroupRequestPath struct {
	PolicyGroupId string `binding:"required"`
}

func DeletePolicyGroup(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path DeletePolicyGroupRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyGroup = Entities.PolicyGroup{}
	if err := db.NewSelect().
		Model(&policyGroup).
		Relation("PolicyTypes").
		Where("uid = ?", path.PolicyGroupId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if policyGroup.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	if len(policyGroup.PolicyTypes) > 0 {
		var names []string
		for _, p := range policyGroup.PolicyTypes {
			s := fmt.Sprintf("%v in use by type %v", policyGroup.Name, p.Name)
			names = append(names, s)
		}
		s := fmt.Sprintln(strings.Join(names[:], ", "))
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Policy group has dependent types: [ %v ]", s)})
		return
	}

	if _, err := db.NewDelete().
		Model(&policyGroup).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
