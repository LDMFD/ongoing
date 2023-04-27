package Commands

import (
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyGroupPath struct {
	PolicyGroupId string `binding:"required"`
}

func UpdatePolicyGroup(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdatePolicyGroupPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyGroup = Entities.PolicyGroup{}
	if err := db.NewSelect().
		Model(&policyGroup).
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

	var req CreateOrUpdatePolicyGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	policyGroup.Name = req.Name

	if _, err := db.NewUpdate().
		Model(&policyGroup).
		Where("uid = ?", path.PolicyGroupId).
		Column("name").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyGroup": policyGroup,
	})
}
