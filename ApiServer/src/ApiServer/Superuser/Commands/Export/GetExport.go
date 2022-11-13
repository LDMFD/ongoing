package Export

import (
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"
)

func GetExport(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	auth := c.MustGet("AUTH").(*AuthService.Client)

	var organisations []Entities.Organisation
	if err := db.NewSelect().
		Model(&organisations).
		Relation("Owner").
		Relation("Creator").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var orgs = map[string][]Entities.ReportFile{}

	for _, org := range organisations {
		var orgFiles []Entities.ReportFile

		if files, err := auth.GetOrgFiles(org.Uid); err != nil {
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

				orgFiles = append(orgFiles, Entities.ReportFile{
					Uid:      fileUid,
					Filename: file.Filename,
					Size:     file.Size,
				})
			}
		}

		orgs[org.Uid] = orgFiles
	}

	c.JSON(200, orgs)
}
