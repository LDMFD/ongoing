package Commands

import (
	"ongoing/Models"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetPolicyTypes(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var policytypes []Models.PolicyType
	if err := db.NewSelect().Model(&policytypes).OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"PolicyTypes": policytypes,
	})
}
