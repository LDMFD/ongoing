package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	FundCommands "ongoing/ApiServer/Advisor/OrgResources/Funds/Commands"
	ModelCommands "ongoing/ApiServer/Advisor/OrgResources/Models/Commands"
	OperatorCommands "ongoing/ApiServer/Advisor/OrgResources/Operators/Commands"
	PolicyProviderCommands "ongoing/ApiServer/Advisor/OrgResources/PolicyProviders/Commands"
	PolicyTypeCommands "ongoing/ApiServer/Advisor/OrgResources/PolicyTypes/Commands"
	ProviderChargeCommands "ongoing/ApiServer/Advisor/OrgResources/ProviderCharges/Commands"
	ModulePresetCommands "ongoing/ApiServer/Advisor/OrgResources/Reviews/ModulePresets/Commands"
	RiskLevelCommands "ongoing/ApiServer/Advisor/OrgResources/RiskLevels/Commands"
	RiskProviderCommands "ongoing/ApiServer/Advisor/OrgResources/RiskProviders/Commands"
	"ongoing/Entities"
	"testing"
)

func testCreateOrgResources(t *testing.T, e *httpexpect.Expect) {
	testCreatePolicyType(e)
	testCreatePolicyProvider(e)
	testCreateProviderCharge(e)
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
	testCreatePolicyTypeBasic(e)
	testCreatePolicyTypeSecurity(e)
}

func testCreatePolicyTypeBasic(e *httpexpect.Expect) {
	// Create Policy Type as org 1 advisor
	request := PolicyTypeCommands.CreateOrUpdatePolicyTypeRequest{
		Name: "ISB",
	}
	resp := e.POST("/api/advisor/policy-types").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyTypeId = resp.JSON().Object().Value("Id").String().Raw()

	request = PolicyTypeCommands.CreateOrUpdatePolicyTypeRequest{
		Name: "ISA",
	}
	e.PUT("/api/advisor/policy-types/"+policyTypeId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testCreatePolicyTypeSecurity(e *httpexpect.Expect) {
	request := PolicyTypeCommands.CreateOrUpdatePolicyTypeRequest{
		Name: "ISNOT",
	}
	e.PUT("/api/advisor/policy-types/"+policyTypeId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/policy-types/"+policyTypeId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreatePolicyProvider(e *httpexpect.Expect) {
	testCreatePolicyProviderBasic(e)
	testCreatePolicyProviderSecurity(e)
}

func testCreatePolicyProviderBasic(e *httpexpect.Expect) {
	// Create Aegon Policy Provider as org 1 advisor
	request := PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name:          "Aegon oops",
		Pricing:       "Aegon does nothing",
		CustomPricing: "",
	}
	resp := e.POST("/api/advisor/policy-providers").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyProviderId2Aegon = resp.JSON().Object().Value("Id").String().Raw()

	request2 := PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name:          policyProviderNameAegon,
		Pricing:       "<p>Aegon operates a tiered charging structure.</p><p>{ table }</p>",
		CustomPricing: "Custom pricing description",
	}
	e.PUT("/api/advisor/policy-providers/"+policyProviderId2Aegon).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request2).
		Expect().Status(http.StatusOK)

	// Aviva
	request = PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name:          policyProviderNameAviva,
		Pricing:       "Aviva levy a platform fee for their pensions, on a tiered basis",
		CustomPricing: "In your case, a single fee of { charge }% per year is levied.",
	}
	resp = e.POST("/api/advisor/policy-providers").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyProviderId1Aviva = resp.JSON().Object().Value("Id").String().Raw()
}

func testCreatePolicyProviderSecurity(e *httpexpect.Expect) {
	request := PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name: "Ab",
	}
	e.PUT("/api/advisor/policy-providers/"+policyProviderId1Aviva).
		WithHeader("Authentication", ORG2_OWNER).
		WithJSON(request).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/policy-providers/"+policyProviderId1Aviva).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreateProviderCharge(e *httpexpect.Expect) {
	testCreateProviderChargeBasic(e)
	testCreateProviderChargeSecurity(e)
}

func testCreateProviderChargeBasic(e *httpexpect.Expect) {
	// Create 1
	providerCharges = make([]string, 5)
	providerCharges[0] = createProviderCharge(e, policyProviderId2Aegon, 1234, 0.00000001)

	// Update 1
	request2 := ProviderChargeCommands.UpdateProviderChargeBody{
		Boundary: 0,
		Charge:   0.42,
	}
	e.PUT("/api/advisor/provider-charges/"+providerCharges[0]).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request2).
		Expect().Status(http.StatusOK)

	// Create the remainder
	providerCharges[1] = createProviderCharge(e, policyProviderId2Aegon, 3000000, 0.39)
	providerCharges[2] = createProviderCharge(e, policyProviderId2Aegon, 5000000, 0.35)
	providerCharges[3] = createProviderCharge(e, policyProviderId2Aegon, 10000000, 0.32)
	providerCharges[4] = createProviderCharge(e, policyProviderId2Aegon, 25000000, 0)
}

func createProviderCharge(e *httpexpect.Expect, providerId string, boundary float64, charge float64) string {
	request := ProviderChargeCommands.CreateProviderChargeRequest{
		Boundary:   boundary,
		Charge:     charge,
		ProviderId: providerId,
	}
	resp := e.POST("/api/advisor/provider-charges").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	return resp.JSON().Object().Value("Id").String().Raw()
}

func testCreateProviderChargeSecurity(e *httpexpect.Expect) {
	request := ProviderChargeCommands.UpdateProviderChargeBody{
		Boundary: 1234,
		Charge:   0.00000001,
	}
	e.PUT("/api/advisor/provider-charges/"+providerCharges[0]).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/provider-charges/"+providerCharges[0]).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreateFund(t *testing.T, e *httpexpect.Expect) {
	fileId := testCreateFundBasic(t, e)
	testCreateFundMutating(t, e, fileId)
	testCreateFundSecurity(t, e)
}

func testCreateFundBasic(t *testing.T, e *httpexpect.Expect) (fileId1 string) {
	fileId1 = TestUpload(t, e, ORG1_ADVISOR, "fund.png")

	fundIdJupiterBalanced = createFund(e, fundNameJupiterBalanced, 0.76, 0.16, &fileId1)
	fundIdInvesco = createFund(e, fundNameInvesco, 0.67, 0.11, nil)
	fundIdFundsmith = createFund(e, fundNameFundsmith, 0.81, 0.09, nil)
	fundIdBaillie = createFund(e, fundNameBaillie, 0.69, 0.08, nil)
	fundIdThreadneedle = createFund(e, fundNameThreadneedle, 0.2, 0.12, nil)

	fundIdJupiterAlpha = createFund(e, fundNameJupiterUKAlpha, 0.76, 0.16, nil)
	fundIdLionTrust = createFund(e, fundNameLiontrust, 0.57, 0.17, nil)
	fundIdSchroderDiscovery = createFund(e, fundNameSchroderRecovery, 0.66, 0.12, nil)
	fundIdVanguardEmerging = createFund(e, fundNameVanguardEmerging, 0.10, 0.40, nil)

	fundIdBlackrock = createFund(e, fundNameBlackrock, 0.68, 0.14, nil)
	fundIdVanguardEuropean = createFund(e, fundNameVanguardEuropean, 0.11, 0.15, nil)
	fundIdSchroderTokyo = createFund(e, fundNameSchroderTokyo, 0.80, 0.11, nil)

	// Test fund 1 file download with different user types
	TestDownload(t, e, ORG1_OWNER, fileId1, true)
	TestDownload(t, e, ORG1_ADVISOR, fileId1, true)
	TestDownload(t, e, ORG2_OWNER, fileId1, false)
	TestDownload(t, e, ORG1_CLIENT, fileId1, false)

	return fundIdJupiterBalanced
}

func createFund(e *httpexpect.Expect, fundName string, ocf float64, exAnte float64, fileId *string) string {
	request := FundCommands.CreateOrUpdateFundRequestBody{
		Name:      fundName,
		OcfFee:    ocf,
		ExAnteFee: exAnte,
		Modified:  "2006-01-02T15:04:05Z",
	}
	if fileId != nil {
		request.File = &Entities.RequestFile{
			Uid:      *fileId,
			Filename: "sample.png",
			//Size:
		}
	}
	resp := e.POST("/api/advisor/funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	return resp.JSON().Object().Value("Id").String().Raw()
}

func testCreateFundMutating(t *testing.T, e *httpexpect.Expect, fileId string) {
	// Remove the file and re-add it, check it still works
	request := FundCommands.CreateOrUpdateFundRequestBody{
		Name:      fundNameJupiterBalanced,
		OcfFee:    0, // Test 0 allowed
		ExAnteFee: 0,
		Modified:  "2006-01-02T15:04:05Z",
	}
	e.PUT("/api/advisor/funds/"+fundIdJupiterBalanced).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Shouldn't be available anymore
	TestDownload(t, e, ORG1_OWNER, fileId, false)

	fundFileId = TestUpload(t, e, ORG1_ADVISOR, "fund-b.png")

	// Add a new file
	request = FundCommands.CreateOrUpdateFundRequestBody{
		Name:      fundNameJupiterBalanced,
		OcfFee:    0.76,
		ExAnteFee: 0.16,
		Modified:  "2006-01-02T15:04:05Z",
		File: &Entities.RequestFile{
			Uid:      fundFileId,
			Filename: "sample.png",
			//Size:
		},
	}
	e.PUT("/api/advisor/funds/"+fundIdJupiterBalanced).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// New file should be available
	TestDownload(t, e, ORG1_OWNER, fundFileId, true)
	TestDownload(t, e, ORG1_ADMIN, fundFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, fundFileId, true)
}

func testCreateFundSecurity(t *testing.T, e *httpexpect.Expect) {
	request := FundCommands.CreateOrUpdateFundRequestBody{
		Name:      "fundless",
		OcfFee:    0.76,
		ExAnteFee: 0.16,
		Modified:  "2006-01-02T12:34:05Z",
		File:      nil, // optional file
	}
	e.PUT("/api/advisor/funds/"+fundIdJupiterBalanced).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/funds/"+fundIdJupiterBalanced).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreateOperator(e *httpexpect.Expect) {
	testCreateOperatorBasic(e)
	testCreateOperatorSecurity(e)
}

func testCreateOperatorBasic(e *httpexpect.Expect) {
	operatorIdAJBell = createOperator(e, operatorNameAJBell, "firm", 0)

	request := OperatorCommands.CreateOrUpdateOperatorRequestBody{
		Name: operatorNameAJBell,
		Type: "dim",
		Fee:  operatorAJFee,
	}
	e.PUT("/api/advisor/operators/"+operatorIdAJBell).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()

	operatorIdBrewin = createOperator(e, operatorNameBrewin, "dim", 0.3)
	operatorIdLgtWM = createOperator(e, operatorNameLgtWM, "dim", 0.2)
	operatorIdTattonCore = createOperator(e, operatorNameTattonCore, "dim", 0.15)
}

func createOperator(e *httpexpect.Expect, operatorName string, operatorType string, fee float64) string {
	request := OperatorCommands.CreateOrUpdateOperatorRequestBody{
		Name: operatorName,
		Type: operatorType,
		Fee:  fee,
	}
	resp := e.POST("/api/advisor/operators").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	return resp.Value("Id").String().Raw()
}

func testCreateOperatorSecurity(e *httpexpect.Expect) {
	request := OperatorCommands.CreateOrUpdateOperatorRequestBody{
		Name: "spam",
		Type: "dim",
		Fee:  0.0023,
	}
	e.PUT("/api/advisor/operators/"+operatorIdAJBell).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/operators/"+operatorIdAJBell).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreateModel(t *testing.T, e *httpexpect.Expect) {
	testCreateModelBasic(t, e)
	testCreateModelSecurity(t, e)
}

func testCreateModelBasic(t *testing.T, e *httpexpect.Expect) {
	modelFileId = TestUpload(t, e, ORG1_ADVISOR, "model.png")

	modelId1 = createModel(e, modelNameLgtVestraAdventurous, operatorIdAJBell, 0, 0, &Entities.RequestFile{
		Uid:      modelFileId,
		Filename: "sample.png",
		//Size:
	})

	// Test model file download with different user types
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, modelFileId, true)
	TestDownload(t, e, ORG2_OWNER, modelFileId, false)
	TestDownload(t, e, ORG1_CLIENT, modelFileId, false)

	// Remove the file and re-add it, check it still works
	request := ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              modelNameLgtVestraAdventurous,
		OperatorId:        operatorIdAJBell,
		WeightedOcfFee:    0.1,
		WeightedExAnteFee: 0.1,
		Modified:          "2006-01-02T15:04:05Z",
		File:              nil,
	}
	e.PUT("/api/advisor/models/"+modelId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Shouldn't be available anymore
	TestDownload(t, e, ORG1_OWNER, modelFileId, false)

	modelFileId = TestUpload(t, e, ORG1_ADVISOR, "model-b.png")

	// Add a new file
	request = ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              modelNameLgtVestraAdventurous,
		OperatorId:        operatorIdLgtWM,
		WeightedOcfFee:    0.73,
		WeightedExAnteFee: 0.15,
		Modified:          "2006-01-02T15:04:05Z",
		File: &Entities.RequestFile{
			Uid:      modelFileId,
			Filename: "sample.png",
			//Size:
		},
	}
	e.PUT("/api/advisor/models/"+modelId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// New file should be available
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)
	TestDownload(t, e, ORG1_ADMIN, modelFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, modelFileId, true)

	modelId2 = createModel(e, modelNameLgtVestraBalanced, operatorIdLgtWM, 0.58, 0.14, nil)
	modelId3 = createModel(e, modelNameTattonCoreActive, operatorIdTattonCore, 0.55, 0.12, nil)
	modelId4 = createModel(e, modelNameAJBell3, operatorIdAJBell, 0.54, 0.12, nil)  // AJ Bell - which operator?
	modelId5 = createModel(e, modelNameAJBell32, operatorIdAJBell, 0.52, 0.09, nil) // AJ Bell - which operator?
	modelId6 = createModel(e, modelNameBrewinCautious, operatorIdBrewin, 0.54, 0.16, nil)
	modelId7 = createModel(e, modelNameBrewinPassive, operatorIdBrewin, 0.11, 0.08, nil)
	modelId8 = createModel(e, modelNameTattonEthicalBalanced, operatorIdTattonCore, 0.65, 0.07, nil)
}

func createModel(e *httpexpect.Expect, modelName string, operatorId string, ocf float64, exAnte float64, file *Entities.RequestFile) string {
	request := ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              modelName,
		OperatorId:        operatorId,
		WeightedOcfFee:    ocf,
		WeightedExAnteFee: exAnte,
		Modified:          "2006-01-02T15:04:05Z",
		File:              file,
	}
	resp := e.POST("/api/advisor/models").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	return resp.JSON().Object().Value("Id").String().Raw()
}

func testCreateModelSecurity(t *testing.T, e *httpexpect.Expect) {
	request := ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              "sir gamble lot",
		OperatorId:        operatorIdAJBell,
		WeightedOcfFee:    0.4,
		WeightedExAnteFee: 0.06,
		Modified:          "2006-01-02T15:04:05Z",
		File:              nil,
	}
	e.PUT("/api/advisor/models/"+modelId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/models/"+modelId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreateRiskProvider(e *httpexpect.Expect) {
	testCreateRiskProviderBasic(e)
	testCreateRiskProviderSecurity(e)
}

func testCreateRiskProviderBasic(e *httpexpect.Expect) {
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

func testCreateRiskProviderSecurity(e *httpexpect.Expect) {
	request := RiskProviderCommands.CreateRiskProviderRequest{
		Name: "no name",
	}
	e.PUT("/api/advisor/risk-providers/"+riskProviderId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/risk-providers/"+riskProviderId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreateRiskLevel(e *httpexpect.Expect) {
	testCreateRiskLevelBasic(e)
	testCreateRiskLevelSecurity(e)
}

func testCreateRiskLevelBasic(e *httpexpect.Expect) {
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

func testCreateRiskLevelSecurity(e *httpexpect.Expect) {
	request := RiskLevelCommands.UpdateRiskLevelBody{
		Level: 1,
		Label: "hacked",
		Desc:  "hacked.",
	}
	e.PUT("/api/advisor/risk-levels/"+riskLevelId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/risk-levels/"+riskLevelId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

var modulePresetText = "preset intro"

func testCreateModulePreset(e *httpexpect.Expect) {
	testCreateModulePresetBasic(e)
	testUpdateModulePreset(e)
}

func testCreateModulePresetBasic(e *httpexpect.Expect) {
	request := ModulePresetCommands.CreateOrUpdateModulePresetRequestBody{
		ModuleType: Entities.ModuleTypeIntroduction,
		Text:       "a poor introduction",
	}
	e.POST("/api/advisor/reviews/module-presets").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	request = ModulePresetCommands.CreateOrUpdateModulePresetRequestBody{
		ModuleType: Entities.ModuleTypeIntroduction,
		Text:       "no intro needed",
	}
	e.POST("/api/advisor/reviews/module-presets").
		WithHeader("Authentication", ORG2_OWNER).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/advisor/reviews/module-presets/"+Entities.ModuleTypeIntroduction).
		WithHeader("Authentication", ORG2_OWNER).
		Expect().Status(http.StatusOK)

	// One preset of a type per org
	request = ModulePresetCommands.CreateOrUpdateModulePresetRequestBody{
		ModuleType: Entities.ModuleTypeIntroduction,
		Text:       "-",
	}
	e.POST("/api/advisor/reviews/module-presets").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusBadRequest)
}

func testUpdateModulePreset(e *httpexpect.Expect) {
	request := ModulePresetCommands.CreateOrUpdateModulePresetRequestBody{
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
	fund.Value("Name").String().Equal(fundNameBaillie) // Baillie
	fund.Value("Modified").String().NotEmpty()
	fund.Value("OcfFee").Number().Equal(0.69)
	fund.Value("ExAnteFee").Number().Equal(0.08)
	fund.Value("Modified").String().NotEmpty()
	resp.Value("Funds").Array().Length().Equal(12)

	resp.Value("Models").Array().First().Object().Value("Name").String().Equal(modelNameAJBell3)
	resp.Value("Models").Array().Length().Equal(8)

	resp.Value("ModulePresets").Array().Length().Equal(1)

	operator := resp.Value("Operators").Array().First().Object()
	operator.Value("Name").String().Equal(operatorNameAJBell)
	operator.Value("Type").String().Equal("dim")
	operator.Value("Fee").Number().Equal(operatorAJFee)
	resp.Value("Operators").Array().Length().Equal(4)

	policyProvider := resp.Value("PolicyProviders").Array().First().Object()
	policyProvider.Value("Name").String().Equal("Aegon")
	policyProvider.Value("Pricing").String().Contains("tiered charging structure")
	policyProvider.Value("CustomPricing").String().Equal("Custom pricing description")
	resp.Value("PolicyProviders").Array().Length().Equal(2)

	resp.Value("PolicyTypes").Array().First().Object().Value("Name").String().Equal("ISA")
	resp.Value("PolicyTypes").Array().Length().Equal(1)

	pcharges := resp.Value("ProviderCharges").Array()
	pcharges.Element(0).Object().Value("Charge").Equal(0.42)
	pcharges.Element(1).Object().Value("Charge").Equal(0.39)
	pcharges.Element(2).Object().Value("Charge").Equal(0.35)
	pcharges.Element(3).Object().Value("Charge").Equal(0.32)
	pcharges.Element(4).Object().Value("Charge").Equal(0)
	pcharges.Length().Equal(5)

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
