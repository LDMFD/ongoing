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
	"strings"
)

type UpdateAdvisorRequestPath struct {
	AdvisorId string `binding:"required"`
}

type UpdateAdvisorRequestBody struct {
	Email     string
	Forenames string
	Surname   string
	Role      string
}

func UpdateAdvisor(c *gin.Context) {
	auth := c.MustGet("AUTH").(*AuthService.Client)
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdateAdvisorRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var body UpdateAdvisorRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	body.Email = strings.ToLower(body.Email)

	if body.Role == Entities.UserTypeClient {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot change staff role to client."})
		return
	}

	var err error
	var advisor *Entities.Advisor
	if advisor, err = Helpers.AdvisorFromUserUID(c, db, path.AdvisorId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No such advisor exists."})
		return
	}

	if relationships, err := auth.ReadOrgRelationships(*session.OrgId, &advisor.User.Uid); err != nil {
		log.Printf("%+v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		for _, r := range relationships {
			if r.Role == Entities.UserTypeOrgOwner {
				if session.Role == Entities.UserTypeOrgOwner {
					if body.Role != Entities.UserTypeOrgOwner {
						c.JSON(http.StatusForbidden, gin.H{"error": "Owner cannot demote owner."})
						return
					}
				} else {
					c.JSON(http.StatusForbidden, gin.H{"error": "Cannot change owner."})
					return
				}
			}
		}
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		panic(err.Error())
	}

	if body.Role != "" {
		if err := auth.UpdateAdvisorRole(*session.OrgId, path.AdvisorId, body.Role); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			//log.Printf("%+v", err)
			_ = tx.Rollback()
			return
		}
	}

	if err := tx.NewSelect().
		Model(advisor).
		Relation("User").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	emailChange := body.Email != advisor.User.Email
	nameChange := body.Surname != advisor.User.Surname || body.Forenames != advisor.User.Forenames

	if emailChange || nameChange {
		advisor.User.Email = body.Email
		advisor.User.Forenames = body.Forenames
		advisor.User.Surname = body.Surname
		if _, err := tx.NewUpdate().Model(&advisor.User).WherePK().
			Column("email").
			Column("forenames").
			Column("surname").
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		log.Println(errors.WithStack(err))
		return
	}

	c.JSON(200, gin.H{})
}
