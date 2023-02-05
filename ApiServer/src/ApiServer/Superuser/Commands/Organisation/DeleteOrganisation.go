package Organisation

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
)

type DeleteOrganisationRequestPath struct {
	OrgId string `binding:"required"`
}

func DeleteOrganisation(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var path DeleteOrganisationRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var err error
	var ownerUid *string
	if ownerUid, err = auth.LookupOrganisationOwner(path.OrgId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No such organisation exists."})
		return
	}

	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, *ownerUid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if _, err := tx.NewDelete().
		Model(advisor).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var org Entities.Organisation
	if _, err := tx.NewDelete().
		Model(&org).
		Where("uid = ?", path.OrgId).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var user Entities.User
	if _, err := tx.NewDelete().
		Model(&user).
		Where("id = ?", advisor.UserId).
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	if err := auth.RemoveMember(advisor.Organisation.Uid, *ownerUid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
	}

	c.JSON(200, gin.H{})
}
