package Export

import (
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/OrgResources"
	"ongoing/ApiServer/Superuser/Commands"
	"ongoing/AuthService"
	"ongoing/Entities"
)

type Org struct {
	Metadata  Entities.ReportOrganisation
	Resources OrgResources.OrgResources
	Clients   []ClientProfile.GetClientResponse
	Files     []Entities.ReportFile
}

type Export struct {
	Users []Entities.ReportUser
	Orgs  []Org
}

func GetExport(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	entities := *Commands.GetAdminEntitiesInternal(c)

	export := Export{
		Users: entities.Users,
		Orgs:  []Org{},
	}

	for _, org := range entities.Organisations {
		clients := ClientProfile.GetClientsInternal(c, org.Id)

		org := Org{
			Metadata:  org,
			Resources: OrgResources.GetOrgResourcesInternal(c, &org.Id).Resources,
			Clients:   []ClientProfile.GetClientResponse{},
			Files:     []Entities.ReportFile{},
		}

		for _, client := range clients {
			var c2 = Entities.Client{}
			if err := db.NewSelect().
				Model(&c2).
				Where("client.uid = ?", client.Id).
				Relation("User").
				Relation("Organisation").
				Scan(c); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "User isn't a client"})
				panic(errors.WithStack(err))
			}

			org.Clients = append(org.Clients, *ClientProfile.GetClientInternal(c, &c2))
		}

		if files, err := auth.GetOrgFiles(org.Metadata.Id); err != nil {
			panic(err)
		} else {
			for _, fileUid := range files {
				var file = Entities.File{}
				if err := db.NewSelect().
					Model(&file).
					Where("uid = ?", fileUid).
					Scan(c); err != nil {
					panic(errors.WithStack(err))
				}

				org.Files = append(org.Files, Entities.ReportFile{
					Uid:      fileUid,
					Filename: file.Filename,
					Size:     file.Size,
				})
			}
		}

		export.Orgs = append(export.Orgs, org)
	}

	c.JSON(200, export)
}
