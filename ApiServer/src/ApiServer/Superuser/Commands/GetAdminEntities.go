package Commands

import (
	"net/http"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetAdminEntities(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	var organisations []Entities.Organisation
	if err := db.NewSelect().
		Model(&organisations).
		Relation("Owner").
		Relation("Creator").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var reportOrganisations = []Entities.ReportOrganisation{}
	var users = map[int64]Entities.ReportUser{}

	for _, o := range organisations {
		reportOrganisations = append(reportOrganisations, o.ToReport())
		users[o.OwnerId] = o.Owner.ToReport()
		users[o.CreatorId] = o.Creator.ToReport()
	}

	var reportUsers = []Entities.ReportUser{}
	for _, user := range users {
		reportUsers = append(reportUsers, user)
	}

	c.JSON(200, gin.H{
		"Organisations": reportOrganisations,
		"Users":         reportUsers,
	})
}
