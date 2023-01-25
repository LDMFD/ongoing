package Organisation

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/OrgResources"
	PolicyTypes "ongoing/ApiServer/Advisor/OrgResources/PolicyTypes/Commands"
	ModulePresets "ongoing/ApiServer/Advisor/OrgResources/Reviews/ModulePresets/Commands"
	RiskLevels "ongoing/ApiServer/Advisor/OrgResources/RiskLevels/Commands"
	RiskProviders "ongoing/ApiServer/Advisor/OrgResources/RiskProviders/Commands"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"strings"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type CreateOrganisationRequestBody struct {
	Email     string `binding:"required"`
	Name      string `binding:"required"`
	Forenames string `binding:"required"`
	Surname   string `binding:"required"`
	SkipSeed  bool
}

func CreateOrganisation(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var body CreateOrganisationRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}
	body.Email = strings.ToLower(body.Email)

	// Begin transaction
	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	owner := Entities.User{}
	if count, err := tx.NewSelect().Model(&owner).Where("email = ?", body.Email).
		ScanAndCount(c); err != nil && err.Error() != "sql: no rows in result set" {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	} else if count == 0 {
		userUid := UUID.GenerateUID(c)

		owner = Entities.User{
			Uid:       userUid,
			Email:     body.Email,
			Forenames: body.Forenames,
			Surname:   body.Surname,
		}
		if _, err := tx.NewInsert().
			Model(&owner).
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Println(errors.WithStack(err))
			_ = tx.Rollback()
			return
		}

		if err := tx.NewSelect().Model(&owner).Where("email = ?", body.Email).Scan(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			log.Println(errors.WithStack(err))
			_ = tx.Rollback()
			return
		}
	}

	if exists, err := db.NewSelect().
		Model((*Entities.Organisation)(nil)).
		Where("name = ?", body.Name).
		Exists(c); err != nil {
		panic(err)
	} else if exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Organisation names must be globally unique."})
		return
	}

	orgUid := UUID.GenerateUID(c)

	var org = Entities.Organisation{
		Uid:       orgUid,
		Name:      body.Name,
		OwnerId:   owner.Id,
		CreatorId: session.UserId,
	}

	if _, err := tx.NewInsert().
		Model(&org).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		tx.Rollback()
		return
	}
	if err := tx.NewSelect().Model(&org).Where("uid = ?", orgUid).Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	if err := auth.CreateOrganisation(owner.Uid, orgUid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err).Error())
		tx.Rollback()
		return
	}

	advisorUid := UUID.GenerateUID(c)

	var advisor = Entities.Advisor{
		Uid:    advisorUid,
		UserId: owner.Id,
		OrgId:  org.Id,
	}
	if _, err := tx.NewInsert().Model(&advisor).Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		_ = tx.Rollback()
		return
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	if !body.SkipSeed {
		seedOrg(c, org)
	}

	c.JSON(200, gin.H{
		"Id":      orgUid,
		"OwnerId": advisorUid,
	})
}

func seedOrg(c *gin.Context, newOrg Entities.Organisation) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var seedOrgs []Entities.Organisation
	if count, err := db.NewSelect().
		Model(&seedOrgs).
		Where("name = ?", "Integral Advice").
		ScanAndCount(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		panic(err.Error())
	} else if count == 0 {
		return
	}
	seedOrg := seedOrgs[0]

	resources := OrgResources.GetOrgResourcesInternal(c, &seedOrg.Uid).Resources

	for _, mp := range resources.ModulePresets {
		ModulePresets.CreateModulePresetInternal(c, newOrg.Id, ModulePresets.CreateOrUpdateModulePresetRequestBody{
			ModuleType: mp.ModuleType,
			Text:       mp.Text,
		})
	}
	for _, pt := range resources.PolicyTypes {
		PolicyTypes.CreatePolicyTypeInternal(c, newOrg.Id, PolicyTypes.CreateOrUpdatePolicyTypeRequestBody{
			Name: pt.Name,
		})
	}
	for _, rp := range resources.RiskProviders {
		uid := RiskProviders.CreateRiskProviderInternal(c, newOrg.Id, RiskProviders.CreateRiskProviderRequestBody{
			Name: rp.Name,
		})
		for _, rl := range resources.RiskLevels {
			if rl.RiskProviderId != rp.Id {
				continue
			}
			RiskLevels.CreateRiskLevelInternal(c, newOrg.Id, RiskLevels.CreateRiskLevelRequestBody{
				RiskProviderId: uid,
				Level:          rl.Level,
				Label:          rl.Label,
				Desc:           rl.Desc,
			})
		}
	}
}
