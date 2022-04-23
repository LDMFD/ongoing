package Clients

import (
	ClientProfile "ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/Clients/Commands/FactFinds"
	Policies "ongoing/ApiServer/Advisor/Clients/Commands/Policies"
	PolicyFunds "ongoing/ApiServer/Advisor/Clients/Commands/PolicyFunds"
	Portfolios "ongoing/ApiServer/Advisor/Clients/Commands/Portfolios"
	Reviews "ongoing/ApiServer/Advisor/Clients/Commands/Reviews"
	"ongoing/ApiServer/Advisor/Clients/Commands/RiskAssessments"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", ClientProfile.GetClients)
	r.POST("", ClientProfile.CreateClient)
	r.GET("/:ClientId", ClientProfile.GetClient)
	r.PUT("/:ClientId", ClientProfile.UpdateClient)
	r.DELETE("/:ClientId", ClientProfile.DeleteClient)

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
	moduleGroup.PUT("/:Module", Reviews.UpdateReviewModule)
	moduleGroup.DELETE("/:Module/field/:Field", Reviews.DeleteReviewModule)

	reviewGroup := r.Group("/:ClientId/reviews")
	reviewGroup.POST("", Reviews.CreateReview)
	reviewGroup.DELETE("/:ReviewId", Reviews.DeleteReview)
	reviewGroup.POST("/:ReviewId/publish", Reviews.Publish)

	factFindGroup := r.Group("/:ClientId/fact-finds")
	factFindGroup.POST("", FactFinds.CreateFactFind)
	factFindGroup.PUT("/:FactFindId", FactFinds.UpdateFactFind)
	factFindGroup.DELETE("/:FactFindId", FactFinds.DeleteFactFind)

	riskAssessmentGroup := r.Group("/:ClientId/risk-assessments")
	riskAssessmentGroup.POST("", RiskAssessments.CreateRiskAssessment)
	riskAssessmentGroup.PUT("/:RiskAssessmentId", RiskAssessments.UpdateRiskAssessment)
	riskAssessmentGroup.DELETE("/:RiskAssessmentId", RiskAssessments.DeleteRiskAssessment)
}
