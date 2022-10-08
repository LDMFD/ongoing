package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	FundCommands "ongoing/ApiServer/Advisor/Global/Funds/Commands"
	ModelCommands "ongoing/ApiServer/Advisor/Global/Models/Commands"
	OperatorCommands "ongoing/ApiServer/Advisor/Global/Operators/Commands"
	PolicyProviderCommands "ongoing/ApiServer/Advisor/Global/PolicyProviders/Commands"
	PolicyTypeCommands "ongoing/ApiServer/Advisor/Global/PolicyTypes/Commands"
	RiskProviderCommands "ongoing/ApiServer/Advisor/Global/RiskProviders/Commands"
	"ongoing/Entities"
	"testing"
)

func TestCreateGlobalEntities(t *testing.T, e *httpexpect.Expect) {
	TestCreatePolicyType(e)
	TestCreatePolicyProvider(e)
	TestCreateFund(t, e)
	TestCreateOperator(e)
	TestCreateModel(t, e)
	TestCreateRiskProvider(e)
	// TODO Module Presets

	TestGetGlobalEntitiesFromThisOrg(e)
	TestGetGlobalEntitiesFromOtherOrg(e)
}

func TestCreatePolicyType(e *httpexpect.Expect) {
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

func TestCreatePolicyProvider(e *httpexpect.Expect) {
	// Create Policy Provider as org 1 advisor
	request := PolicyProviderCommands.CreateOrUpdatePolicyProviderRequest{
		Name:          "Aegon",
		Pricing:       "<p>Aegon operates a tiered charging structure.</p><p>{{ table }}</p>",
		CustomPricing: "",
	}
	resp := e.POST("/api/advisor/policy-providers").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyProviderId = resp.JSON().Object().Value("Id").String().Raw()
}

func TestCreateFund(t *testing.T, e *httpexpect.Expect) {
	fileId := TestUpload(t, e, ORG1_ADVISOR, "fund.png")

	// Create Fund (no file) as org 1 advisor
	request := FundCommands.CreateOrUpdateFundRequestBody{
		Name:      "Jupiter Balanced",
		OcfFee:    0.76,
		ExAnteFee: 0.16,
		Modified:  "2006-01-02T15:04:05Z",
		File: &Entities.RequestFile{
			Uid:      fileId,
			Filename: "sample.png",
			//Size:
		},
	}
	resp := e.POST("/api/advisor/funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	fundId1 = resp.JSON().Object().Value("Id").String().Raw()

	// Create Fund (with file) as org 1 advisor
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

	// Test file download with different user types
	TestDownload(t, e, ORG1_OWNER, fileId, true)
	TestDownload(t, e, ORG1_ADVISOR, fileId, true)
	TestDownload(t, e, ORG2_OWNER, fileId, false)
	TestDownload(t, e, ORG1_CLIENT, fileId, false)
}

func TestCreateOperator(e *httpexpect.Expect) {
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

func TestCreateModel(t *testing.T, e *httpexpect.Expect) {
	fileId := TestUpload(t, e, ORG1_ADVISOR, "model.png")

	request := ModelCommands.CreateOrUpdateModelRequestBody{
		Name:              "FE Invest Hybrid Risk Level 3 Long",
		OperatorId:        operatorId,
		WeightedOcfFee:    0.4,
		WeightedExAnteFee: 0.06,
		//Modified:          "",
		File: &Entities.RequestFile{
			Uid:      fileId,
			Filename: "sample.png",
			//Size:
		},
	}
	resp := e.POST("/api/advisor/models").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	modelId = resp.JSON().Object().Value("Id").String().Raw()
}

func TestCreateRiskProvider(e *httpexpect.Expect) {
	request := RiskProviderCommands.CreateRiskProviderRequest{
		Name: "Dynamic Planner",
	}
	e.POST("/api/advisor/risk-providers").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func TestGetGlobalEntitiesFromThisOrg(e *httpexpect.Expect) {
	// Test GetGlobalEntities
	resp := e.GET("/api/advisor/global").
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK).JSON().Object().
		Value("Entities").Object()

	resp.Value("Funds").Array().First().Object().Value("Name").String().Equal("Jupiter Balanced")
	resp.Value("Funds").Array().First().Object().Value("Modified").String().NotEmpty()
	resp.Value("Funds").Array().First().Object().Value("OcfFee").Number().Equal(0.76)
	resp.Value("Funds").Array().First().Object().Value("ExAnteFee").Number().Equal(0.16)
	resp.Value("Funds").Array().First().Object().Value("Modified").String().NotEmpty()
	resp.Value("Funds").Array().Length().Equal(2)

	resp.Value("Models").Array().First().Object().Value("Name").String().Equal("FE Invest Hybrid Risk Level 3 Long")
	resp.Value("Models").Array().Length().Equal(1)

	resp.Value("ModulePresets").Array().Length().Equal(0)

	resp.Value("Operators").Array().First().Object().Value("Name").String().Equal("FE Invest")
	resp.Value("Operators").Array().First().Object().Value("Type").String().Equal("dim")
	resp.Value("Operators").Array().First().Object().Value("Fee").Number().Equal(0.0023)
	resp.Value("Operators").Array().Length().Equal(1)

	resp.Value("PolicyProviders").Array().First().Object().Value("Name").String().Equal("Aegon")
	resp.Value("PolicyProviders").Array().First().Object().Value("CustomPricing").String().Equal("")
	//resp.Value("PolicyProviders").Array().First().Object().Value("Pricing")
	resp.Value("PolicyProviders").Array().Length().Equal(1)

	resp.Value("PolicyTypes").Array().First().Object().Value("Name").String().Equal("ISA")
	resp.Value("PolicyTypes").Array().Length().Equal(1)

	resp.Value("ProviderCharges").Array().Empty()

	resp.Value("RiskProviders").Array().First().Object().Value("Name").String().Equal("Dynamic Planner")
	resp.Value("RiskProviders").Array().Length().Equal(1)

	resp.Value("RiskLevels").Array().Empty()
}

func TestGetGlobalEntitiesFromOtherOrg(e *httpexpect.Expect) {
	// Test GetGlobalEntities of advisor in other org
	resp := e.GET("/api/advisor/global").
		WithHeader("Authentication", ORG2_OWNER).
		Expect().Status(http.StatusOK).JSON().Object().
		Value("Entities").Object()
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
