package Helpers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/Entities"
)

func AdvisorFromUserUID(c *gin.Context, db *bun.DB, uid string) (*Entities.Advisor, error) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var advisor = Entities.Advisor{}
	if err := db.NewSelect().
		Model(&advisor).
		Relation("Organisation").
		Relation("User").
		Where("\"user\".\"uid\" = ?", uid).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User isn't a advisor"})
		err = errors.WithStack(err) // TODO test this reports the stacktrace
		return nil, err
	}

	if !IsSuperuser(session.Email) && advisor.Organisation.Uid != *session.OrgId {
		msg := fmt.Sprintf("Unauthorized access attempt by: %v", session.Email)
		if c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println(msg)
		}
		c.AbortWithStatus(http.StatusForbidden)
		err := errors.New(msg)
		return nil, err
	}

	return &advisor, nil
}
