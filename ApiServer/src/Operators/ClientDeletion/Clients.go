package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

func DeleteClient(c *gin.Context, tx bun.Tx, dbClient *Entities.Client, dtoClient *Entities.Client, exportClient *Entities.ExportClient) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	for _, factFind := range dbClient.FactFinds {
		DeleteFactFind(c, &tx, dtoClient.Uid, factFind)
	}
	for _, feesReport := range dbClient.FeesReports {
		DeleteFeesReport(c, &tx, dtoClient.Uid, feesReport)
	}
	for _, forecast := range dbClient.Forecasts {
		DeleteForecast(c, &tx, dtoClient.Uid, forecast)
	}
	for _, riskAssessment := range dbClient.RiskAssessments {
		DeleteRiskAssessment(c, &tx, dtoClient.Uid, riskAssessment)
	}
	for _, providerDiscount := range dbClient.ProviderDiscounts {
		DeleteProviderDiscount(c, &tx, providerDiscount)
	}
	for _, policy := range dbClient.Policies {
		DeletePolicy(context, &tx, dtoClient.Uid, policy.Uid, true) // context different
	}
	for _, module := range dbClient.Modules {
		DeleteModule(c, &tx, module)
	}
	for _, review := range exportClient.Reviews {
		DeleteReview(c, &tx, dbClient, &review)
	}
	DeletePendingReview(c, &tx, dbClient.Id)
}
