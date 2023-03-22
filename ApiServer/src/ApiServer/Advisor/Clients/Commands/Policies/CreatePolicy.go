package Policies

import (
	"database/sql"
	"ongoing/ApiServer/Helpers"
	"ongoing/Entities"
	"ongoing/ServiceContext"
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
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db
	response := &context.Response

	var path CreatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		response.InvalidInput()
		return
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		response.InvalidInput()
		return
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		response.NotFound()
		return
	}

	if exists, err := db.NewSelect().Model((*Entities.Policy)(nil)).
		Where("external_id = ?", body.ExternalId).
		Where("client_id = ?", client.Id).
		Where("policy_provider.uid = ?", body.PolicyProviderId).
		Relation("PolicyProvider").
		Exists(c); err != nil {
		response.Panic(err)
		panic(err.Error())
	} else if exists {
		response.UniqueViolation()
		return
	}

	var policyType = Entities.PolicyType{}
	if err := db.NewSelect().
		Model(&policyType).
		Where("uid = ?", body.PolicyTypeId).
		Scan(c); err != nil {
		response.Panic(err)
	}

	var provider = Entities.PolicyProvider{}
	if err := db.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		response.Panic(err)
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
		response.Panic(err)
	}

	if body.File != nil {
		policy.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	}

	if _, err := tx.NewInsert().Model(&policy).Exec(c); err != nil {
		response.Panic(err)
	}

	if body.File != nil {
		if err := context.Auth.CreateClientFile(client.Uid, context.Session.Org.Uid, body.File.Uid); err != nil {
			_ = tx.Rollback()
			response.Panic(err)
		}
	}

	if err := tx.Commit(); err != nil {
		response.Panic(err)
	}

	response.ReturnID(&uid)
}
