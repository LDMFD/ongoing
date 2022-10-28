package Commands

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

func DeleteAdvisor(c *gin.Context) {
	auth := c.MustGet("AUTH").(*AuthService.Client)
	db := c.MustGet("DATABASE").(*bun.DB)

	var path UpdateOrDeleteAdvisorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var err error
	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, path.AdvisorId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No such advisor exists."})
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	var orgId string
	if orgs, err := auth.LookupOrganisations(advisor.User.Uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		orgId = orgs[0]
	}

	if err := auth.RemoveMember(orgId, advisor.User.Uid); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Printf("%+v", err)
		_ = tx.Rollback()
		return
	}

	if _, err := tx.NewDelete().
		Model(advisor).
		WherePK().
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

	c.JSON(200, gin.H{})
}
