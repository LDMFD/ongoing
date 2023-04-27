package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreateOrUpdatePolicyGroupRequest struct {
	Name string `binding:"required"`
}

func CreatePolicyGroup(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	uid := UUID.GenerateUID(c)

	var req CreateOrUpdatePolicyGroupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var policyGroup = Entities.PolicyGroup{
		Uid:   uid,
		Name:  req.Name,
		OrgId: session.Org.Id,
	}
	if _, err := db.NewInsert().Model(&policyGroup).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{
		"Id": uid,
	})
}
