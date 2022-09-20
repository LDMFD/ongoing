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

func ClientFromUID(c *gin.Context, db *bun.DB, uid string) (*Entities.Client, error) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var client = Entities.Client{}
	if err := db.NewSelect().
		Model(&client).
		Where("client.uid = ?", uid).
		Relation("User"). // for client.ToReport()
		Relation("Organisation").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User isn't a client"})
		err = errors.WithStack(err) // TODO test this reports the stacktrace
		return nil, err
	}

	// Clients can only be looked up by advisors in the same org
	if client.Organisation.Uid != *session.OrgId {
		msg := fmt.Sprintf("Unauthorized access attempt by: %v", session.Email)
		log.Println(msg)
		c.AbortWithStatus(http.StatusForbidden)
		err := errors.New(msg)
		return nil, err
	}

	return &client, nil
}
