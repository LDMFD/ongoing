package Clients

import (
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientOptions"
	ClientProfile "ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/Clients/Commands/FactFinds"
	"ongoing/ApiServer/Advisor/Clients/Commands/FeesReports"
	"ongoing/ApiServer/Advisor/Clients/Commands/Forecasts"
	Policies "ongoing/ApiServer/Advisor/Clients/Commands/Policies"
	PolicyFunds "ongoing/ApiServer/Advisor/Clients/Commands/PolicyFunds"
	Portfolios "ongoing/ApiServer/Advisor/Clients/Commands/Portfolios"
	"ongoing/ApiServer/Advisor/Clients/Commands/ProviderDiscount"
	"ongoing/ApiServer/Advisor/Clients/Commands/ReviewModules"
	"ongoing/ApiServer/Advisor/Clients/Commands/RiskAssessments"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", ClientProfile.GetClients)
	r.POST("", ClientProfile.CreateClient)
	r.GET("/:ClientId", ClientProfile.GetClient)
	r.PUT("/:ClientId", ClientProfile.UpdateClient)
	r.DELETE("/:ClientId", ClientProfile.DeleteClient)

	optionsGroup := r.Group("/:ClientId/options")
	optionsGroup.PUT("", ClientOptions.SetOptions)

	providerDiscountGroup := r.Group("/:ClientId/platform-discounts")
	providerDiscountGroup.POST("", ProviderDiscount.CreateProviderDiscount)
	providerDiscountGroup.PUT("/:ProviderDiscountId", ProviderDiscount.UpdateProviderDiscount)
	providerDiscountGroup.DELETE("/:ProviderDiscountId", ProviderDiscount.DeleteProviderDiscount)

	policyGroup := r.Group("/:ClientId/policies")
	policyGroup.POST("", Policies.CreatePolicy)
	policyGroup.PUT("/:PolicyId", Policies.UpdatePolicy)
	policyGroup.DELETE("/:PolicyId", Policies.DeletePolicy)

	portfolioGroup := r.Group("/:ClientId/portfolios")
	portfolioGroup.POST("", Portfolios.CreatePortfolio)
	portfolioGroup.PUT("/:PortfolioId", Portfolios.UpdatePortfolio)
	portfolioGroup.DELETE("/:PortfolioId", Portfolios.DeletePortfolio)

	policyFundGroup := r.Group("/:ClientId/policy-funds")
	policyFundGroup.POST("", PolicyFunds.CreatePolicyFund)
	policyFundGroup.PUT("/:PolicyFundId", PolicyFunds.UpdatePolicyFund)
	policyFundGroup.DELETE("/:PolicyFundId", PolicyFunds.DeletePolicyFund)

	moduleGroup := r.Group("/:ClientId/modules")
	moduleGroup.PUT("/:Module", ReviewModules.UpdateReviewModule)
	moduleGroup.DELETE("/:Module/field/:Field", ReviewModules.DeleteReviewModule)

	reviewGroup := r.Group("/:ClientId/reviews")
	reviewGroup.POST("/import", ClientProfile.ImportReview)
	reviewGroup.PUT("/:ReviewId", ClientProfile.UpdateReview)
	reviewGroup.POST("/:ReviewId/publish", ClientProfile.PublishReview)
	reviewGroup.DELETE("/:ReviewId", ClientProfile.DeleteReview)

	factFindGroup := r.Group("/:ClientId/fact-finds")
	factFindGroup.POST("", FactFinds.CreateFactFind)
	factFindGroup.PUT("/:FactFindId", FactFinds.UpdateFactFind)
	factFindGroup.DELETE("/:FactFindId", FactFinds.DeleteFactFind)

	forecastGroup := r.Group("/:ClientId/forecasts")
	forecastGroup.POST("", Forecasts.CreateForecast)
	forecastGroup.PUT("/:ForecastId", Forecasts.UpdateForecast)
	forecastGroup.DELETE("/:ForecastId", Forecasts.DeleteForecast)

	riskAssessmentGroup := r.Group("/:ClientId/risk-assessments")
	riskAssessmentGroup.POST("", RiskAssessments.CreateRiskAssessment)
	riskAssessmentGroup.PUT("/:RiskAssessmentId", RiskAssessments.UpdateRiskAssessment)
	riskAssessmentGroup.DELETE("/:RiskAssessmentId", RiskAssessments.DeleteRiskAssessment)

	feesReportGroup := r.Group("/:ClientId/fees-reports")
	feesReportGroup.POST("", FeesReports.CreateFeesReport)
	feesReportGroup.PUT("/:FeesReportId", FeesReports.UpdateFeesReport)
	feesReportGroup.DELETE("/:FeesReportId", FeesReports.DeleteFeesReport)
}
