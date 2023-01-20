package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreateRiskProviderRequestBody struct {
	Name string `binding:"required"`
}

func CreateRiskProvider(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateRiskProviderRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := CreateRiskProviderInternal(c, session.Org.Id, body)

	c.JSON(200, gin.H{
		"Id": uid,
	})
}

func CreateRiskProviderInternal(c *gin.Context, orgId int64, body CreateRiskProviderRequestBody) string {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := UUID.GenerateUID(c)

	var riskProvider = Entities.RiskProvider{
		Uid:   uid,
		Name:  body.Name,
		OrgId: orgId,
	}
	if _, err := db.NewInsert().Model(&riskProvider).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	return uid
}
