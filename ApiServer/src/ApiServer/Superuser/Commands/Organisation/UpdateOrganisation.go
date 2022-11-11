package Organisation

import (
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type UpdateOrganisationRequestPath struct {
	OrgId string `binding:"required"`
}

type UpdateOrganisationRequestBody struct {
	Name string `binding:"required"`
}

func UpdateOrganisation(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	var path UpdateOrganisationRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	// Superuser can update all orgs, non-superusers can only update their own
	if session.Role != Entities.UserTypeSuperuser && *session.OrgId != path.OrgId {
		if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", session.Email)
		}
		c.AbortWithStatus(http.StatusForbidden)
		return
	}

	var body UpdateOrganisationRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var organisation = Entities.Organisation{}
	if err := db.NewSelect().
		Model(&organisation).
		Where("uid = ?", path.OrgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	organisation.Name = body.Name

	if _, err := db.NewUpdate().Model(&organisation).WherePK().
		Column("name").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	c.JSON(200, gin.H{})
}
