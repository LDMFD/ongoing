package Commands

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Utils/Array"
)

type ReorderProviderChargesPath struct {
	ProviderId string `binding:"required"`
}

type ReorderProviderChargesBody struct {
	From int // `binding:"required"`
	To   int //`binding:"required"`
}

func ReorderProviderCharges(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path ReorderProviderChargesPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body ReorderProviderChargesBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	//1. select them all into an array
	//2. re-order the array
	//3. loop through and re-write the sequence

	var charges = []Entities.ProviderCharge{}
	if err := db.NewSelect().
		Model(&charges).
		Relation("PolicyProvider").
		Where("policy_provider.uid = ?", path.ProviderId).
		OrderExpr("sequence ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if len(charges) == 0 || charges[0].PolicyProvider.OrgId != session.Org.Id {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	ids := make([]int64, len(charges))
	idToUid := map[int64]string{}
	for ix, c := range charges {
		ids[ix] = c.Id
		idToUid[c.Id] = c.Uid
	}

	Array.Swap(&ids, body.From, body.To)

	for seq, id := range ids {
		var charge = Entities.ProviderCharge{
			Sequence: int64(seq),
		}
		if _, err := db.NewUpdate().
			Model(&charge).
			Where("id = ?", id).
			Column("sequence").
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
	}

	c.JSON(200, gin.H{})
}
