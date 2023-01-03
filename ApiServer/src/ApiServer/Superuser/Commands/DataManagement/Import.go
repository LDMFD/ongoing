package DataManagement

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Storage/Commands"
	"ongoing/Database"
	"ongoing/Entities"
	"ongoing/Importer"
	"ongoing/Utils/Http"
)

type ImportRequestBody struct {
	FileId string
}

func Import(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var body ImportRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	log.Println("DB: Import starting...")

	Database.Truncate(db)

	log.Println("DB: Seeding...")

	Database.SeedUserTable(db)

	var bytes []byte
	var err error

	url := Commands.GenerateSignedGetUrl(body.FileId)

	if bytes, err = Http.Fetch(url); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	export := &Entities.Export{}
	if err := json.Unmarshal(bytes, export); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	log.Println("DB: Importing...")

	if err := Importer.RunImport(export); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	log.Println("DB: Import complete!")

	c.Status(200)
}
