package Policies

import (
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"strings"

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
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path CreatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		Errors.Unexpected(c, err)
		return
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		Errors.Unexpected(c, err)
		return
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no such client exists"})
		Errors.Unexpected(c, err)
		return
	}

	if exists, err := db.NewSelect().Model((*Entities.Policy)(nil)).
		Where("external_id = ?", body.ExternalId).
		Where("client_id = ?", client.Id).
		Where("policy_provider.uid = ?", body.PolicyProviderId).
		Relation("PolicyProvider").
		Exists(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": Errors.UniqueViolation})
		return
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
		ExternalId:           strings.TrimSpace(body.ExternalId),
		MonthlyContributions: body.MonthlyContributions,
		StartValue:           body.StartValue,
		EndValue:             body.EndValue,
		PolicyTypeId:         policyType.Id,
		PolicyProviderId:     provider.Id,
		Notes:                body.Notes,
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if body.File != nil {
		policy.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	if _, err := tx.NewInsert().Model(&policy).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if body.File != nil {
		if err := auth.CreateClientFile(client.Uid, session.Org.Uid, body.File.Uid); err != nil {
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
