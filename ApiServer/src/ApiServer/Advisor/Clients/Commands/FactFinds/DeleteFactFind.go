package FactFinds

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteFactFindRequestPath struct {
	ClientId   string `binding:"required"`
	FactFindId string `binding:"required"`
}

func DeleteFactFind(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteFactFindRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var factFind = Entities.FactFind{}
	if err := db.NewSelect().
		Model(&factFind).
		Where("uid = ?", path.FactFindId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	client := Entities.ClientFromUserUID(c, db, path.ClientId)
	if factFind.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "FactFind does not belong to client"})
		return
	}

	if _, err := db.NewDelete().
		Model(&factFind).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
