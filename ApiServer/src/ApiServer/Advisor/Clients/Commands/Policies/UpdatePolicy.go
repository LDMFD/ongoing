package Policies

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Config"
	"ongoing/Entities"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdatePolicyRequestPath struct {
	ClientId string `binding:"required"`
	PolicyId string `binding:"required"`
}

func UpdatePolicy(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path UpdatePolicyRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body CreateOrUpdatePolicyRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var err error
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	var policy = Entities.Policy{}
	if err := tx.NewSelect().
		Model(&policy).
		Relation("FilePtr.File").
		Where("policy.uid = ?", path.PolicyId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var client *Entities.Client
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			panic(err)
		}
		return
	}

	if policy.ClientId != client.Id {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Policy does not belong to client"})
		return
	}

	var policyType = Entities.PolicyType{}
	if err := tx.NewSelect().
		Model(&policyType).
		Where("uid = ?", body.PolicyTypeId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var provider = Entities.PolicyProvider{}
	if err := tx.NewSelect().
		Model(&provider).
		Where("uid = ?", body.PolicyProviderId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	// FilePtr has been removed or changed; remove old relationship
	if (body.File != nil && policy.FilePtr != nil && body.File.Uid != policy.FilePtr.File.Uid) || (body.File == nil && policy.FilePtr != nil) {
		if err := auth.RemoveFileFromClientAndOrg(path.ClientId, session.Org.Uid, policy.FilePtr.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		Helpers.DeleteFile(c, tx, *policy.FilePtr)
	}
	if body.File != nil {
		if err := auth.CreateClientFile(client.Uid, session.Org.Uid, body.File.Uid); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
		policy.FilePtrId = Helpers.CreateFileRef(c, tx, body.File)
	} else {
		policy.FilePtrId = nil
		policy.FilePtr = nil
	}

	policy.ExternalId = strings.TrimSpace(body.ExternalId)
	policy.MonthlyContributions = body.MonthlyContributions
	policy.StartValue = body.StartValue
	policy.EndValue = body.EndValue
	policy.PolicyTypeId = policyType.Id
	policy.PolicyProviderId = provider.Id
	policy.Notes = body.Notes

	if _, err := tx.NewUpdate().
		Model(&policy).
		WherePK().
		Column("external_id").
		Column("monthly_contributions").
		Column("start_value").
		Column("end_value").
		Column("policy_type_id").
		Column("policy_provider_id").
		Column("notes").
		Column("file_ptr_id").
		Exec(c); err != nil {
		Errors.HandleError(c, err)
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
