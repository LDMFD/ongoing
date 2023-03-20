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

type CreateOrUpdatePolicyTypeRequestBody struct {
	Name string `binding:"required"`
}

func CreatePolicyType(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateOrUpdatePolicyTypeRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := CreatePolicyTypeInternal(c, session.Org.Id, body)

	c.JSON(200, gin.H{
		"Id": uid,
	})
}

func CreatePolicyTypeInternal(c *gin.Context, orgId int64, body CreateOrUpdatePolicyTypeRequestBody) string {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := UUID.GenerateUID(c)

	var policyType = Entities.PolicyType{
		Uid:   uid,
		Name:  strings.TrimSpace(body.Name),
		OrgId: orgId,
	}
	if _, err := db.NewInsert().Model(&policyType).Exec(c); err != nil {
		Errors.Unexpected(c, err)
		return ""
	}
	return uid
}
