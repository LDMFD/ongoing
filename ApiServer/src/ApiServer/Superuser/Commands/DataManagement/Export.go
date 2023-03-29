package DataManagement

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/OrgResources"
	"ongoing/ApiServer/Superuser/Commands"
	"ongoing/AuthService"
	"ongoing/Entities"
	"sort"
)

func Export(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	entities := *Commands.GetAdminEntitiesInternal(c)

	export := Entities.Export{
		Users: entities.Users,
		Orgs:  []Entities.Org{},
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered: ", r)
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}()

	for _, org := range entities.Organisations {
		clients := ClientProfile.GetClientsInternal(c, org.Id)

		org := Entities.Org{
			Metadata:  org,
			Resources: OrgResources.GetOrgResourcesInternal(c, &org.Id).Resources,
			Clients:   []Entities.ExportClient{},
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

			cx, _ := ClientProfile.GetClientInternal(c, &c2)
			org.Clients = append(org.Clients, *cx)
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
			sort.Slice(org.Files, func(i, j int) bool {
				return org.Files[i].Uid < org.Files[j].Uid
			})
		}

		export.Orgs = append(export.Orgs, org)
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(200, export)
}
