package ClientSpace

import (
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Global/Reviews/ModulePresets/Commands"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetClientSpace(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	user := c.MustGet("USER").(*Entities.User)
	log.Println(user)

	var client = Entities.Client{UserId: user.Id}
	if err := db.NewSelect().
		Model(&client).
		Relation("Policies.PolicyProvider").
		Relation("PolicyFunds.Fund").
		Relation("Portfolios.Model.Operator").
		Relation("Reviews.Modules").
		Relation("User").
		Where("user_id = ?", client.UserId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	modulePresets := Commands.GetModulePresetsInternal(c, db)

	c.JSON(200, gin.H{
		"Client": client,
		"ModulePresets": modulePresets,
	})
}
