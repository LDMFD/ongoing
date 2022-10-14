package Export

import (
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/Global"
	"ongoing/ApiServer/Superuser/Commands"
	"ongoing/Entities"
)

type Org struct {
	Metadata       Entities.ReportOrganisation
	GlobalEntities Global.GlobalEntitiesResponse
	Clients        []ClientProfile.GetClientResponse
}

type Export struct {
	AdminEntities Commands.AdminEntitiesResponse
	Orgs          []Org
}

func GetExport(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	entities := *Commands.GetAdminEntitiesInternal(c)

	export := Export{
		AdminEntities: entities,
		Orgs:          []Org{},
	}

	for _, org := range entities.Organisations {
		clients := ClientProfile.GetClientsInternal(c, org.Id)

		o := Org{
			Metadata:       org,
			GlobalEntities: *Global.GetGlobalEntitiesInternal(c, &org.Id),
			Clients:        []ClientProfile.GetClientResponse{},
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

			o.Clients = append(o.Clients, *ClientProfile.GetClientInternal(c, &c2))
		}
		export.Orgs = append(export.Orgs, o)
	}

	c.JSON(200, export)
}
