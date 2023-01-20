package Commands

import (
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyTypePath struct {
	PolicyTypeId string `binding:"required"`
}

func UpdatePolicyType(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdatePolicyTypePath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyType = Entities.PolicyType{}
	if err := db.NewSelect().
		Model(&policyType).
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

	var req CreateOrUpdatePolicyTypeRequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	policyType.Name = req.Name

	if _, err := db.NewUpdate().
		Model(&policyType).
		Where("uid = ?", path.PolicyTypeId).
		Column("name").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{
		"PolicyType": policyType,
	})
}
