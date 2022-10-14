package Commands

import (
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type AdminEntitiesResponse struct {
	Organisations []Entities.ReportOrganisation
	Users         []Entities.ReportUser
}

func GetAdminEntities(c *gin.Context) {
	c.JSON(http.StatusOK, GetAdminEntitiesInternal(c))
}

func GetAdminEntitiesInternal(c *gin.Context) *AdminEntitiesResponse {
	db := c.MustGet("DATABASE").(*bun.DB)
	authClient := c.MustGet("AUTH").(*AuthService.Client)

	var organisations []Entities.Organisation
	if err := db.NewSelect().
		Model(&organisations).
		Relation("Owner").
		Relation("Creator").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var users []Entities.User
	if err := db.NewSelect().
		Model(&users).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var reportOrganisations = []Entities.ReportOrganisation{}
	var userMap = map[int64]Entities.ReportUser{}

	for _, o := range organisations {
		org := o.ToReport()

		userMap[o.OwnerId] = o.Owner.ToReport()
		userMap[o.CreatorId] = o.Creator.ToReport()

		members, err := authClient.LookupUsers(o.Uid)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
		for _, mId := range members {
			member := Entities.OrganisationMember{
				UserId: mId,
				Role:   "",
			}
			for _, u := range users {
				if u.Uid == mId {
					userMap[u.Id] = u.ToReport()
					relationships, err := authClient.ReadOrgRelationships(o.Uid, &u.Uid)
					if err != nil {
						c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
						panic(err.Error())
					}
					if len(relationships) != 1 {
						c.JSON(http.StatusBadRequest, gin.H{"error": "inconsistency"})
						panic(err.Error())
					}

					//var advisor []Entities.User
					//if err := db.NewSelect().
					//	Model(&users).
					//	Scan(c); err != nil {
					//	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					//	panic(err.Error())
					//}

					member.Role = relationships[0].Role
					member.Forenames =
				}
			}
			org.Members = append(org.Members, member)
		}

		reportOrganisations = append(reportOrganisations, org)
	}

	var reportUsers = []Entities.ReportUser{}
	for _, user := range userMap {
		reportUsers = append(reportUsers, user)
	}

	return &AdminEntitiesResponse{
		Organisations: reportOrganisations,
		Users:         reportUsers,
	}
}
