package Commands
//
//import (
//	"net/http"
//	"ongoing/Models"
//
//	"github.com/uptrace/bun"
//
//	"github.com/gin-gonic/gin"
//)
//
//type GetPortfolioRequestPath struct {
//	PortfolioId int64 `binding:"required"`
//}
//
//func GetPortfolio(c *gin.Context) {
//	db := c.MustGet("DATABASE").(*bun.DB)
//
//	var path GetPortfolioRequestPath
//	if err := c.ShouldBindUri(&path); err != nil {
//		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//		return
//	}
//
//	var portfolio = Models.Portfolio{Id: path.PortfolioId}
//	if err := db.NewSelect().
//		Model(&portfolio).
//		WherePK().
//		Scan(c); err != nil {
//		panic(err)
//	}
//	c.JSON(200, gin.H{
//		"Portfolio": portfolio,
//	})
//}
