package Policies
//
//import (
//	"net/http"
//	"ongoing/Entities"
//
//	"github.com/uptrace/bun"
//
//	"github.com/gin-gonic/gin"
//)
//
//type GetPoliciesRequestPath struct {
//	ClientId int64 `binding:"required"`
//}
//
//func GetPolicies(c *gin.Context) {
//	db := c.MustGet("DATABASE").(*bun.DB)
//
//	var path GetPoliciesRequestPath
//	if err := c.ShouldBindUri(&path); err != nil {
//		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//		return
//	}
//
//	var policies []Entities.Policy
//	if err := db.NewSelect().
//		Model(&policies).
//		Where("client_id = ?", path.ClientId).
//		OrderExpr("id ASC").
//		Scan(c); err != nil {
//		panic(err)
//	}
//	c.JSON(200, gin.H{
//		"Policies": policies,
//	})
//}
