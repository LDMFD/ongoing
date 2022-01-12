package Commands

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
//type GetModelRequestPath struct {
//	ModelId int64 `binding:"required"`
//}
//
//func GetModel(c *gin.Context) {
//	db := c.MustGet("DATABASE").(*bun.DB)
//
//	var path GetModelRequestPath
//	if err := c.ShouldBindUri(&path); err != nil {
//		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//		return
//	}
//
//	var model = Entities.Model{Id: path.ModelId}
//	if err := db.NewSelect().
//		Model(&model).
//		WherePK().
//		Scan(c); err != nil {
//		panic(err)
//	}
//	c.JSON(200, gin.H{
//		"Model": model,
//	})
//}
