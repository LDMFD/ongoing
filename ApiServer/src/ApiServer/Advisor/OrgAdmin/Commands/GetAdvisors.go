package Commands

import (
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/AuthService"
	"ongoing/Entities"
	"sort"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

func GetAdvisors(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)
	authClient := c.MustGet("AUTH").(*AuthService.Client)

	var reportAdvisors = []Entities.AdvisorReport{}

	if relationships, err := authClient.ReadOrgRelationships(*session.OrgId, nil); err != nil {
		log.Printf("%+v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	} else {
		for _, r := range relationships {
			var user Entities.User
			if err := db.NewSelect().Model(&user).Where("uid = ?", r.UserId).Scan(c); err != nil {
				log.Printf("%+v", err)
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			if r.Role == Entities.UserTypeClient {
				continue
			}

			var advisor *Entities.Advisor
			if advisor, err = Helpers.AdvisorFromUserUID(c, db, r.UserId); err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "no such advisor exists"})
				panic(err.Error())
			}

			reportAdvisors = append(reportAdvisors, Entities.AdvisorReport{
				Id:        user.Uid,
				Email:     user.Email,
				Forenames: advisor.Forenames,
				Surname:   advisor.Surname,
				Role:      r.Role,
			})
		}
	}

	sort.Slice(reportAdvisors, func(i, j int) bool {
		return reportAdvisors[i].Email < reportAdvisors[j].Email
	})

	c.JSON(200, gin.H{
		"Advisors": reportAdvisors,
	})
}
