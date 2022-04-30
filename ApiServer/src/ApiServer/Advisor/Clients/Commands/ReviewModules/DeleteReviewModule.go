package ReviewModules

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type DeleteReviewModulePath struct {
	ClientId string `binding:"required"`
	Module string `binding:"required"`
	Field string `binding:"required,oneof=intro text"`
}

func DeleteReviewModule(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteReviewModulePath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)

	module := &Entities.Module{}
	if err := db.NewSelect().
		Model(module).
		Where("client_id = ? AND type = ?", client.Id, path.Module).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	if path.Field == "intro" {
		module.Intro = ""
	}
	if path.Field == "text" {
		module.Text = ""
	}

	if module.Intro == "" && module.Text == "" {
		if _, err := db.NewDelete().
			Model(module).
			Where("client_id = ? AND type = ?", client.Id, path.Module).
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	} else {
		if _, err := db.NewUpdate().
			Model(module).
			WherePK().
			Column("intro").
			Column("text").
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{})
	}

	c.JSON(200, gin.H{})
}
