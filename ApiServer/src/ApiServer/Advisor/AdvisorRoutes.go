package Advisor

import (
	"github.com/gin-gonic/gin"
	"ongoing/ApiServer/Advisor/Clients"
	OrgResources "ongoing/ApiServer/Advisor/OrgResources"
	"ongoing/ApiServer/Advisor/OrgResources/Funds"
	"ongoing/ApiServer/Advisor/OrgResources/Models"
	"ongoing/ApiServer/Advisor/OrgResources/Operators"
	"ongoing/ApiServer/Advisor/OrgResources/PolicyGroups"
	"ongoing/ApiServer/Advisor/OrgResources/PolicyProviders"
	"ongoing/ApiServer/Advisor/OrgResources/PolicyTypes"
	"ongoing/ApiServer/Advisor/OrgResources/ProviderCharges"
	"ongoing/ApiServer/Advisor/OrgResources/Reviews"
	"ongoing/ApiServer/Advisor/OrgResources/RiskLevels"
	"ongoing/ApiServer/Advisor/OrgResources/RiskProviders"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("/org-resources", OrgResources.GetOrgResources)
	Clients.AddRoutes(r.Group("/clients"))
	Funds.AddRoutes(r.Group("/funds"))
	Operators.AddRoutes(r.Group("/operators"))
	Models.AddRoutes(r.Group("/models"))
	PolicyGroups.AddRoutes(r.Group("/policy-groups"))
	PolicyProviders.AddRoutes(r.Group("/policy-providers"))
	PolicyTypes.AddRoutes(r.Group("/policy-types"))
	ProviderCharges.AddRoutes(r.Group("/provider-charges"))
	RiskProviders.AddRoutes(r.Group("/risk-providers"))
	RiskLevels.AddRoutes(r.Group("/risk-levels"))
	Reviews.AddRoutes(r.Group("/reviews"))

	r.PUT("/organisations/:OrgId", Organisation.UpdateOrganisation)
}
