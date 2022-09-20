package Policies

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/UUID"

	"github.com/gin-gonic/gin"
)

type CreatePolicyRequestPath struct {
	ClientId string `binding:"required"`
}

type CreateOrUpdatePolicyRequestBody struct {
	ExternalId           string `binding:"required"`
	MonthlyContributions int64
	StartValue           int64
	EndValue             int64
	PolicyTypeId         string `binding:"required"`
	PolicyProviderId     string `binding:"required"`
	Notes                string
	File                 *Entities.RequestFile
}

func CreatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path CreatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var fileId *int64
	if body.File != nil && body.File.Uid != "" {
		var file Entities.File
		if count, err := db.NewSelect().Model(&file).Where("uid = ?", body.File.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File not found"})
			panic(err.Error())
		}
		fileId = &file.Id
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		panic(err.Error())
	}

	var policyType = Entities.PolicyType{}
	if err := db.NewSelect().
		Model(&policyType).
		Where("uid = ?", body.PolicyTypeId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	uid := UUID.GenerateUID(c)

	var policy = Entities.Policy{
		Uid:                  uid,
		ClientId:             client.Id,
		ExternalId:           body.ExternalId,
		MonthlyContributions: body.MonthlyContributions,
		StartValue:           body.StartValue,
		EndValue:             body.EndValue,
		PolicyTypeId:         policyType.Id,
		PolicyProviderId:     provider.Id,
		Notes:                body.Notes,
		FileId:               fileId,
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if _, err := tx.NewInsert().Model(&policy).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if body.File != nil {
		if err := auth.CreateFile(&client.Uid, nil, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{
		"Id": uid,
	})
}
