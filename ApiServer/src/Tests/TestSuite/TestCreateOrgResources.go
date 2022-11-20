package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	FundCommands "ongoing/ApiServer/Advisor/OrgResources/Funds/Commands"
	ModelCommands "ongoing/ApiServer/Advisor/OrgResources/Models/Commands"
	OperatorCommands "ongoing/ApiServer/Advisor/OrgResources/Operators/Commands"
	PolicyProviderCommands "ongoing/ApiServer/Advisor/OrgResources/PolicyProviders/Commands"
	PolicyTypeCommands "ongoing/ApiServer/Advisor/OrgResources/PolicyTypes/Commands"
	"ongoing/ApiServer/Advisor/OrgResources/Reviews/ModulePresets/Commands"
	RiskLevelCommands "ongoing/ApiServer/Advisor/OrgResources/RiskLevels/Commands"
	RiskProviderCommands "ongoing/ApiServer/Advisor/OrgResources/RiskProviders/Commands"
	"ongoing/Entities"
	"testing"
)

func testCreateOrgResources(t *testing.T, e *httpexpect.Expect) {
	testCreatePolicyType(e)
	testCreatePolicyProvider(e)
	testCreateFund(t, e)
	testCreateOperator(e)
	testCreateModel(t, e)
	testCreateRiskProvider(e)
	testCreateRiskLevel(e)
	testCreateModulePreset(e)

	testGetOrgResourcesFromThisOrg(e)
	testGetGlobalEntitiesFromOtherOrg(e)
}

func testCreatePolicyType(e *httpexpect.Expect) {
	// Create Policy Type as org 1 advisor
	request := PolicyTypeCommands.CreatePolicyTypeRequest{
		Name: "ISA",
	}
	resp := e.POST("/api/advisor/policy-types").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyTypeId = resp.JSON().Object().Value("Id").String().Raw()
}

func testCreatePolicyProvider(e *httpexpect.Expect) {
	// Create Policy Provider as org 1 advisor
	request := PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name:          "Aegon oops",
		Pricing:       "Aegon does nothing",
		CustomPricing: "",
	}
	resp := e.POST("/api/advisor/policy-providers").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyProviderId = resp.JSON().Object().Value("Id").String().Raw()

	request2 := PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name:          "Aegon",
		Pricing:       "<p>Aegon operates a tiered charging structure.</p><p>{{ table }}</p>",
		CustomPricing: "12.5",
	}
	e.PUT("/api/advisor/policy-providers/"+policyProviderId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request2).
		Expect().Status(http.StatusOK)
}

func testCreateFund(t *testing.T, e *httpexpect.Expect) {
	fileId1 := TestUpload(t, e, ORG1_ADVISOR, "fund.png")

	// Create Fund 1 (with file) as org 1 advisor
	request := FundCommands.CreateOrUpdateFundRequestBody{
		Name:      "Jupiter Balanced",
		OcfFee:    0.76,
		ExAnteFee: 0.16,
		Modified:  "2006-01-02T15:04:05Z",
		File: &Entities.RequestFile{
			Uid:      fileId1,
			Filename: "sample.png",
			//Size:
		},
	}
	resp := e.POST("/api/advisor/funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	fundId1 = resp.JSON().Object().Value("Id").String().Raw()

	// Create Fund 2 (no file) as org 1 advisor
	request = FundCommands.CreateOrUpdateFundRequestBody{
		Name:      "LF Equity Income C Acc",
		OcfFee:    0.75,
		ExAnteFee: 0.38,
		Modified:  "2022-05-20T15:04:05Z",
	}
	resp = e.POST("/api/advisor/funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	fundId2 = resp.JSON().Object().Value("Id").String().Raw()

	// Test fund 1 file download with different user types
	TestDownload(t, e, ORG1_OWNER, fileId1, true)
	TestDownload(t, e, ORG1_ADVISOR, fileId1, true)
	TestDownload(t, e, ORG2_OWNER, fileId1, false)
	TestDownload(t, e, ORG1_CLIENT, fileId1, false)

	// Remove the file and re-add it, check it still works
	request = FundCommands.CreateOrUpdateFundRequestBody{
		Name:      "Jupiter Balanced",
		OcfFee:    0.76,
		ExAnteFee: 0.16,
		Modified:  "2006-01-02T15:04:05Z",
	}
	resp = e.PUT("/api/advisor/funds/"+fundId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Shouldn't be available anymore
	TestDownload(t, e, ORG1_OWNER, fileId1, false)

	fundFileId = TestUpload(t, e, ORG1_ADVISOR, "fund-b.png")

	// Add a new file
	request = FundCommands.CreateOrUpdateFundRequestBody{
		Name:      "Jupiter Balanced",
		OcfFee:    0.76,
		ExAnteFee: 0.16,
		Modified:  "2006-01-02T15:04:05Z",
		File: &Entities.RequestFile{
			Uid:      fundFileId,
			Filename: "sample.png",
			//Size:
		},
	}
	resp = e.PUT("/api/advisor/funds/"+fundId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// New file should be available
	TestDownload(t, e, ORG1_OWNER, fundFileId, true)
	TestDownload(t, e, ORG1_ADMIN, fundFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, fundFileId, true)
}

func testCreateOperator(e *httpexpect.Expect) {
	request := OperatorCommands.CreateOperatorRequestBody{
		Name: "FE Invest",
		Type: "dim",
		Fee:  0.0023,
	}
	resp := e.POST("/api/advisor/operators").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	operatorId = resp.Value("Id").String().Raw()
}

func testCreateModel(t *testing.T, e *httpexpect.Expect) {
	modelFileId = TestUpload(t, e, ORG1_ADVISOR, "model.png")

	request := ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              "FE Invest Hybrid Risk Level 3 Long",
		OperatorId:        operatorId,
		WeightedOcfFee:    0.4,
		WeightedExAnteFee: 0.06,
		//Modified:          "",
		File: &Entities.RequestFile{
			Uid:      modelFileId,
			Filename: "sample.png",
			//Size:
		},
	}
	resp := e.POST("/api/advisor/models").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	modelId = resp.JSON().Object().Value("Id").String().Raw()

	// Test model file download with different user types
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, modelFileId, true)
	TestDownload(t, e, ORG2_OWNER, modelFileId, false)
	TestDownload(t, e, ORG1_CLIENT, modelFileId, false)

	// Remove the file and re-add it, check it still works
	request = ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              "FE Invest Hybrid Risk Level 3 Long",
		OperatorId:        operatorId,
		WeightedOcfFee:    0.4,
		WeightedExAnteFee: 0.06,
		//Modified:          "2006-01-02T15:04:05Z",
		File: nil,
	}
	resp = e.PUT("/api/advisor/models/"+modelId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Shouldn't be available anymore
	TestDownload(t, e, ORG1_OWNER, modelFileId, false)

	modelFileId = TestUpload(t, e, ORG1_ADVISOR, "model-b.png")

	// Add a new file
	request = ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              "FE Invest Hybrid Risk Level 3 Long",
		OperatorId:        operatorId,
		WeightedOcfFee:    0.4,
		WeightedExAnteFee: 0.06,
		File: &Entities.RequestFile{
			Uid:      modelFileId,
			Filename: "sample.png",
			//Size:
		},
	}
	resp = e.PUT("/api/advisor/models/"+modelId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// New file should be available
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)
	TestDownload(t, e, ORG1_ADMIN, modelFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, modelFileId, true)
}

func testCreateRiskProvider(e *httpexpect.Expect) {
	// Create risk provider
	request := RiskProviderCommands.CreateRiskProviderRequest{
		Name: "Dynamic Planner oops",
	}
	resp := e.POST("/api/advisor/risk-providers").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	riskProviderId = resp.JSON().Object().Value("Id").String().Raw()

	// Update provider
	request3 := RiskProviderCommands.UpdateRiskProviderRequest{
		Name: "Dynamic Planner",
	}
	resp = e.PUT("/api/advisor/risk-providers/"+riskProviderId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request3).
		Expect().Status(http.StatusOK)
}

func testCreateRiskLevel(e *httpexpect.Expect) {
	request := RiskLevelCommands.CreateRiskLevelRequest{
		RiskProviderId: riskProviderId,
		Level:          5,
		Label:          "Middling",
		Desc:           "Middletown.",
	}
	resp := e.POST("/api/advisor/risk-levels").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	riskLevelId = resp.JSON().Object().Value("Id").String().Raw()

	request2 := RiskLevelCommands.UpdateRiskLevelBody{
		Level: 10,
		Label: "Highest",
		Desc:  "Risky McJones here.",
	}
	resp = e.PUT("/api/advisor/risk-levels/"+riskLevelId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request2).
		Expect().Status(http.StatusOK)
}

var modulePresetText = "preset intro"

func testCreateModulePreset(e *httpexpect.Expect) {
	createModulePreset(e)
	updateModulePreset(e)
}

func createModulePreset(e *httpexpect.Expect) {
	request := Commands.CreateOrUpdateModulePresetRequestBody{
		ModuleType: Entities.ModuleTypeIntroduction,
		Text:       "a poor introduction",
	}
	e.POST("/api/advisor/reviews/module-presets").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func updateModulePreset(e *httpexpect.Expect) {
	request := Commands.CreateOrUpdateModulePresetRequestBody{
		ModuleType: Entities.ModuleTypeIntroduction,
		Text:       modulePresetText,
	}
	e.PUT("/api/advisor/reviews/module-presets/"+Entities.ModuleTypeIntroduction).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testGetOrgResourcesFromThisOrg(e *httpexpect.Expect) {
	// Test GetGlobalEntities
	resp := e.GET("/api/advisor/org-resources").
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK).JSON().Object().
		Value("Resources").Object()

	fund := resp.Value("Funds").Array().First().Object()
	fund.Value("Name").String().Equal("Jupiter Balanced")
	fund.Value("Modified").String().NotEmpty()
	fund.Value("OcfFee").Number().Equal(0.76)
	fund.Value("ExAnteFee").Number().Equal(0.16)
	fund.Value("Modified").String().NotEmpty()
	resp.Value("Funds").Array().Length().Equal(2)

	resp.Value("Models").Array().First().Object().Value("Name").String().Equal("FE Invest Hybrid Risk Level 3 Long")
	resp.Value("Models").Array().Length().Equal(1)

	resp.Value("ModulePresets").Array().Length().Equal(1)

	operator := resp.Value("Operators").Array().First().Object()
	operator.Value("Name").String().Equal("FE Invest")
	operator.Value("Type").String().Equal("dim")
	operator.Value("Fee").Number().Equal(0.0023)
	resp.Value("Operators").Array().Length().Equal(1)

	policyProvider := resp.Value("PolicyProviders").Array().First().Object()
	policyProvider.Value("Name").String().Equal("Aegon")
	policyProvider.Value("Pricing").String().Contains("tiered charging structure")
	policyProvider.Value("CustomPricing").String().Equal("12.5")
	resp.Value("PolicyProviders").Array().Length().Equal(1)

	resp.Value("PolicyTypes").Array().First().Object().Value("Name").String().Equal("ISA")
	resp.Value("PolicyTypes").Array().Length().Equal(1)

	resp.Value("ProviderCharges").Array().Empty()

	resp.Value("RiskProviders").Array().First().Object().Value("Name").String().Equal("Dynamic Planner")
	resp.Value("RiskProviders").Array().Length().Equal(1)

	resp.Value("RiskLevels").Array().First().Object().Value("Label").String().Equal("Highest")
	resp.Value("RiskLevels").Array().Length().Equal(1)

	mp := resp.Value("ModulePresets").Array().First().Object()
	mp.Value("ModuleType").String().Equal(Entities.ModuleTypeIntroduction)
	mp.Value("Text").String().Equal(modulePresetText)
	resp.Value("ModulePresets").Array().Length().Equal(1)
}

func testGetGlobalEntitiesFromOtherOrg(e *httpexpect.Expect) {
	// Test GetGlobalEntities of advisor in other org
	resp := e.GET("/api/advisor/org-resources").
		WithHeader("Authentication", ORG2_OWNER).
		Expect().Status(http.StatusOK).JSON().Object().
		Value("Resources").Object()
	resp.Value("Funds").Array().Empty()
	resp.Value("Models").Array().Empty()
	resp.Value("ModulePresets").Array().Empty()
	resp.Value("Operators").Array().Empty()
	resp.Value("PolicyProviders").Array().Empty()
	resp.Value("PolicyTypes").Array().Empty()
	resp.Value("ProviderCharges").Array().Empty()
	resp.Value("RiskProviders").Array().Empty()
	resp.Value("RiskLevels").Array().Empty()
}
