package RiskAssessments

import (
	"database/sql"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/Config"
	"ongoing/Entities"
	"ongoing/Operators/ClientDeletion"
	"ongoing/ServiceContext"

	"github.com/uptrace/bun"

	"github.com/gin-gonic/gin"
)

type DeleteRiskAssessmentRequestPath struct {
	ClientId         string `binding:"required"`
	RiskAssessmentId string `binding:"required"`
}

func DeleteRiskAssessment(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := c.MustGet("DATABASE").(*bun.DB)

	var path DeleteRiskAssessmentRequestPath
	if err := c.ShouldBindUri(&path); err != nil {
		context.Response.InvalidInput()
		return
	}

	var assessment = Entities.RiskAssessment{}
	if err := db.NewSelect().
		Model(&assessment).
		Relation("FilePtr.File").
		Where("risk_assessment.uid = ?", path.RiskAssessmentId).
		Scan(c); err != nil {
		context.Response.Panic(err)
	}

	var client *Entities.Client
	var err error
	if client, err = Helpers.ClientFromUID(c, db, path.ClientId); err != nil {
		if !(Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true") {
			context.Response.Panic(err)
		}
		return
	}

	if assessment.ClientId != client.Id {
		context.Response.NotFound()
		return
	}

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

	ClientDeletion.DeleteRiskAssessment(c, &tx, client.Uid, &assessment)

	if err := tx.Commit(); err != nil {
		context.Response.Panic(err)
	}

	c.Status(http.StatusOK)
}
