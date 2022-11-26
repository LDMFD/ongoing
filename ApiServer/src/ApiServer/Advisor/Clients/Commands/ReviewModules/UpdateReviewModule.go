package ReviewModules

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
)

type UpdateReviewModulePath struct {
	ClientId string `binding:"required"`
	Module   string `binding:"required"`
}

type UpdateReviewModuleRequestBody struct {
	Intro string
	Text  string
}

func UpdateReviewModule(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateReviewModulePath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body UpdateReviewModuleRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err.Error())
		}
		return
	}

	module := &Entities.Module{
		ClientId: client.Id,
		Type:     path.Module,
		Intro:    body.Intro,
		Text:     body.Text,
	}
	if _, err := db.NewInsert().Model(module).
		On("CONFLICT (client_id, \"type\") DO UPDATE").
		Set("\"intro\" = EXCLUDED.intro").
		Set("\"text\" = EXCLUDED.text").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	c.JSON(200, gin.H{})
}
