package Advisor

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Clients"
	OrgResources "ongoing/ApiServer/Advisor/OrgResources"
	"ongoing/ApiServer/Advisor/OrgResources/Funds"
	"ongoing/ApiServer/Advisor/OrgResources/Models"
	"ongoing/ApiServer/Advisor/OrgResources/Operators"
	"ongoing/ApiServer/Advisor/OrgResources/PolicyProviders"
	"ongoing/ApiServer/Advisor/OrgResources/PolicyTypes"
	"ongoing/ApiServer/Advisor/OrgResources/ProviderCharges"
	"ongoing/ApiServer/Advisor/OrgResources/Reviews"
	"ongoing/ApiServer/Advisor/OrgResources/RiskLevels"
	"ongoing/ApiServer/Advisor/OrgResources/RiskProviders"
	Staff "ongoing/ApiServer/Advisor/Staff/Commands"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/org-resources", OrgResources.GetOrgResources)
	r.GET("/team", Staff.GetAdvisors)
	r.PUT("/organisations/:OrgId", Organisation.UpdateOrganisation)

	Clients.AddRoutes(r.Group("/clients"))
	Funds.AddRoutes(r.Group("/funds"))
	Operators.AddRoutes(r.Group("/operators"))
	Models.AddRoutes(r.Group("/models"))
	PolicyTypes.AddRoutes(r.Group("/policy-types"))
	PolicyProviders.AddRoutes(r.Group("/policy-providers"))
	ProviderCharges.AddRoutes(r.Group("/provider-charges"))
	RiskProviders.AddRoutes(r.Group("/risk-providers"))
	RiskLevels.AddRoutes(r.Group("/risk-levels"))
	Reviews.AddRoutes(r.Group("/reviews"))
}
