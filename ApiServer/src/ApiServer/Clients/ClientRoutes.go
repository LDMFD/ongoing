package Clients

import (
	"ongoing/ApiServer/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Clients/Commands/Holdings"
	"ongoing/ApiServer/Clients/Commands/Policies"
	"ongoing/ApiServer/Clients/Commands/Reviews"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", ClientProfile.GetClients)
	r.POST("", ClientProfile.CreateClient)
	r.GET("/:ClientId", ClientProfile.GetClient)
	r.PUT("/:ClientId", ClientProfile.UpdateClient)

	reviewGroup := r.Group("/:ClientId/reviews")
	reviewGroup.POST("", Reviews.CreateReview)

	policyGroup := r.Group("/:ClientId/policies")
	//policyGroup.GET("", Policies.GetPolicies)
	policyGroup.POST("", Policies.CreatePolicy)
	//policyGroup.GET("/:PolicyId", Policies.GetPolicy)
	policyGroup.PUT("/:PolicyId", Policies.UpdatePolicy)

	holdingGroup := r.Group("/:ClientId/holdings")
	holdingGroup.POST("", Holdings.CreateHolding)
	holdingGroup.PUT("/:HoldingId", Holdings.UpdateHolding)
}
