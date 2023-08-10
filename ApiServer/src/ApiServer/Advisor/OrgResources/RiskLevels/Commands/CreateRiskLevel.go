package Commands

import (
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreateRiskLevelRequestBody struct {
	RiskProviderId string `binding:"required"`
	Level          int64
	Label          string `binding:"required"`
	Desc           string
}

func CreateRiskLevel(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var body CreateRiskLevelRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := CreateRiskLevelInternal(c, session.Org.Id, body)

	c.JSON(200, gin.H{
		"Id": uid,
	})
}

func CreateRiskLevelInternal(c *gin.Context, orgId int64, body CreateRiskLevelRequestBody) string {
	db := c.MustGet("DATABASE").(*bun.DB)

	uid := UUID.GenerateUID(c)

	var provider = Entities.RiskProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.RiskProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var riskLevel = Entities.RiskLevel{
		Uid:            uid,
		RiskProviderId: provider.Id,
		Level:          body.Level,
		Label:          body.Label,
		Desc:           body.Desc,
	}
	if _, err := db.NewInsert().Model(&riskLevel).Exec(c); err != nil {
		Errors.Unexpected(c, err)
	}
	return uid
}
