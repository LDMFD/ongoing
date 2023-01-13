package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"ongoing/Entities"
	"testing"
)

func testDeleteOrgResources(t *testing.T, e *httpexpect.Expect) {
	TestDeleteModels(t, e)
	TestDeleteOperators(t, e)
	TestDeleteFunds(t, e)
	TestDeleteProviderCharges(t, e)
	TestDeletePolicyProviders(t, e)
	TestDeletePolicyTypes(t, e)
	TestDeleteRiskLevels(t, e)
	TestDeleteRiskProviders(t, e)
	TestDeleteModulePresets(t, e)
}

func TestDeleteModels(t *testing.T, e *httpexpect.Expect) {
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)

	deleteModel(e, modelId1)
	deleteModel(e, modelId2)
	deleteModel(e, modelId3)
	deleteModel(e, modelId4)
	deleteModel(e, modelId5)
	deleteModel(e, modelId6)
	deleteModel(e, modelId7)
	deleteModel(e, modelId8)

	// TODO
	//// Owner can still read the file due to the client review
	//TestDownload(t, e, ORG1_OWNER, modelFileId, true)
	//
	//// Admin can also read it
	//TestDownload(t, e, ORG1_ADMIN, modelFileId, true)

	// Advisors (not of that client) cannot read the file anymore
	TestDownload(t, e, ORG1_ADVISOR, modelFileId, false)
}

func deleteModel(e *httpexpect.Expect, modelId string) {
	e.DELETE("/api/advisor/models/"+modelId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteOperators(t *testing.T, e *httpexpect.Expect) {
	deleteOperator(e, operatorIdAJBell)
	deleteOperator(e, operatorIdBrewin)
	deleteOperator(e, operatorIdLgtWM)
	deleteOperator(e, operatorIdTattonCore)
}

func deleteOperator(e *httpexpect.Expect, operatorId string) {
	e.DELETE("/api/advisor/operators/"+operatorId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteFunds(t *testing.T, e *httpexpect.Expect) {
	TestDownload(t, e, ORG1_OWNER, fundFileId, true)

	deleteFund(e, fundIdJupiterBalanced)
	deleteFund(e, fundIdInvesco)
	deleteFund(e, fundIdFundsmith)
	deleteFund(e, fundIdBaillie)
	deleteFund(e, fundIdThreadneedle)
	deleteFund(e, fundIdJupiterAlpha)
	deleteFund(e, fundIdLionTrust)
	deleteFund(e, fundIdSchroderDiscovery)
	deleteFund(e, fundIdVanguardEmerging)
	deleteFund(e, fundIdBlackrock)
	deleteFund(e, fundIdVanguardEuropean)
	deleteFund(e, fundIdSchroderTokyo)

	//// Owner can still read the file due to the client review
	//TestDownload(t, e, ORG1_OWNER, fundFileId, true)
	//
	//// Admin can also read it
	//TestDownload(t, e, ORG1_ADMIN, fundFileId, true)

	// Advisors (not of that client) cannot read the file anymore
	TestDownload(t, e, ORG1_ADVISOR, fundFileId, false)
}

func deleteFund(e *httpexpect.Expect, fundId string) {
	e.DELETE("/api/advisor/funds/"+fundId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteProviderCharges(t *testing.T, e *httpexpect.Expect) {
	for i := range providerCharges {
		e.DELETE("/api/advisor/provider-charges/"+providerCharges[i]).
			WithHeader("Authentication", ORG1_ADVISOR).
			Expect().Status(http.StatusOK)
	}
}

func TestDeletePolicyProviders(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/policy-providers/"+policyProviderId1Aviva).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/advisor/policy-providers/"+policyProviderId2Aegon).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeletePolicyTypes(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/policy-types/"+policyTypeId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteRiskLevels(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/risk-levels/"+riskLevelId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteRiskProviders(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/risk-providers/"+riskProviderId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteModulePresets(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/reviews/module-presets/"+Entities.ModuleTypeIntroduction).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}
