package Clients

import (
	"ongoing/ApiServer/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Clients/Commands/Policies"
	"ongoing/ApiServer/Clients/Commands/PolicyFunds"
	"ongoing/ApiServer/Clients/Commands/Portfolios"
	"ongoing/ApiServer/Clients/Commands/Reviews"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", ClientProfile.GetClients)
	r.POST("", ClientProfile.CreateClient)
	r.GET("/:ClientId", ClientProfile.GetClient)
	r.PUT("/:ClientId", ClientProfile.UpdateClient)
	r.DELETE("/:ClientId", ClientProfile.DeleteClient)

	reviewGroup := r.Group("/:ClientId/reviews")
	reviewGroup.POST("", Reviews.CreateReview)

	policyGroup := r.Group("/:ClientId/policies")
	policyGroup.POST("", Policies.CreatePolicy)
	policyGroup.PUT("/:PolicyId", Policies.UpdatePolicy)
	policyGroup.DELETE("/:PolicyId", Policies.DeletePolicy)

	portfolioGroup := r.Group("/:ClientId/portfolios")
	portfolioGroup.POST("", Portfolios.CreatePortfolio)
	portfolioGroup.PUT("/:PortfolioId", Portfolios.UpdatePortfolio)

	policyFundGroup := r.Group("/:ClientId/policy-funds")
	policyFundGroup.POST("", PolicyFunds.CreatePolicyFund)
	policyFundGroup.PUT("/:PolicyFundId", PolicyFunds.UpdatePolicyFund)
}
