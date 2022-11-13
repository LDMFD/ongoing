package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

func testClientReviews(t *testing.T, e *httpexpect.Expect) {
	testCreateAndPublishReview(e)
	testGetClient(t, e)
	testGetClients(e)
	testGetClientSpace(t, e)
}

func testCreateAndPublishReview(e *httpexpect.Expect) {
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/reviews").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK).JSON().Object()
	reviewId = resp.Value("Id").String().Raw()

	e.POST("/api/advisor/clients/"+org1ClientId+"/reviews/"+reviewId+"/publish").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK)

	// Create review as the client - forbidden
	e.POST("/api/advisor/clients/"+org1ClientId+"/reviews").
		WithHeader("Authentication", ORG1_CLIENT).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	// Create review as the owner of another org - forbidden
	e.POST("/api/advisor/clients/"+org1ClientId+"/reviews").
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testGetClient(t *testing.T, e *httpexpect.Expect) {
	obj := e.GET("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK).JSON().Object()

	validateClientResponse(t, e, obj)

	// As the client - forbidden
	e.GET("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG1_CLIENT).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	// As the superuser - forbidden
	e.GET("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", SUPERUSER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	// As the owner of another org - forbidden
	e.GET("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testGetClients(e *httpexpect.Expect) {
	// TODO
}

func testGetClientSpace(t *testing.T, e *httpexpect.Expect) {
	testOrg1ClientSpace(t, e)
	testOrg2ClientSpace(e)
}

func testOrg1ClientSpace(t *testing.T, e *httpexpect.Expect) {
	obj := e.GET("/api/client-space").
		WithHeader("Authentication", ORG1_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object()

	validateClientResponse(t, e, obj)
}

func testOrg2ClientSpace(e *httpexpect.Expect) {
	obj := e.GET("/api/client-space").
		WithHeader("Authentication", ORG2_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object()

	cc := obj.Value("Metadata").Object()
	cc.ValueEqual("Id", org2ClientId)
	cc.ValueEqual("Fee", 0.2)
	cc.Value("Identity").Object().ValueEqual("Email", ORG2_CLIENT)
	cc.Value("Identity").Object().ValueEqual("Forenames", "Bob")
	cc.Value("Identity").Object().ValueEqual("Surname", "Client")

	obj.Value("Reviews").Array().Empty()
}

func validateClientResponse(t *testing.T, e *httpexpect.Expect, obj *httpexpect.Object) {
	cc := obj.Value("Metadata").Object()
	cc.ValueEqual("Id", org1ClientId)
	cc.ValueEqual("Fee", 0.1)
	cc.Value("Identity").Object().ValueEqual("Email", ORG1_CLIENT)
	cc.Value("Identity").Object().ValueEqual("Forenames", "Adam")
	cc.Value("Identity").Object().ValueEqual("Surname", "Client")

	review := obj.Value("Reviews").Array().First().Object()
	review.ValueEqual("Id", reviewId)

	report := review.Value("Report").Object()
	report.Value("ModulePresets").Array().Empty()

	report.Value("Modules").Array().Empty()

	report.Value("PolicyTypes").Array().First().Object().ValueEqual("Name", "ISA")

	report.Value("PolicyProviders").Array().First().Object().ValueEqual("Name", "Aegon")
	report.Value("PolicyProviders").Array().First().Object().Value("Pricing").String().Contains("tiered charging structure")
	report.Value("PolicyProviders").Array().First().Object().Value("CustomPricing").String().Equal("12.5")
	report.Value("PolicyProviders").Array().Length().Equal(1)

	report.Value("ProviderCharges").Array().Empty()

	report.Value("ProviderDiscounts").Array().First().Object().ValueEqual("PolicyProviderId", policyProviderId)
	report.Value("ProviderDiscounts").Array().First().Object().ValueEqual("Discount", 0.12)
	report.Value("ProviderDiscounts").Array().Length().Equal(1)

	report.Value("Policies").Array().First().Object().ValueEqual("ExternalId", "external-pol")
	report.Value("Policies").Array().First().Object().ValueEqual("MonthlyContributions", 10)
	report.Value("Policies").Array().First().Object().ValueEqual("StartValue", 100)
	report.Value("Policies").Array().First().Object().ValueEqual("EndValue", 200)
	report.Value("Policies").Array().First().Object().ValueEqual("PolicyTypeId", policyTypeId)
	report.Value("Policies").Array().First().Object().ValueEqual("PolicyProviderId", policyProviderId)
	report.Value("Policies").Array().First().Object().ValueEqual("Notes", "Policy notes")
	report.Value("Policies").Array().Element(0).Object().Value("File").Object().ValueEqual("Filename", "policy-b.png")
	report.Value("Policies").Array().Length().Equal(1)

	//policyFileId := report.Value("Policies").Array().First().Object().Value("File").Object().Value("Uid").String().Raw()
	TestDownload(t, e, ORG1_CLIENT, policyFileId, true)
	TestDownload(t, e, ORG2_CLIENT, policyFileId, false)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)

	report.Value("Funds").Array().Length().Equal(2)

	report.Value("Funds").Array().Element(0).Object().ValueEqual("Name", "Jupiter Balanced")
	report.Value("Funds").Array().Element(0).Object().ValueEqual("ExAnteFee", 0.16)
	report.Value("Funds").Array().Element(0).Object().ValueEqual("OcfFee", 0.76)
	report.Value("Funds").Array().Element(0).Object().Value("Modified").String().NotEmpty()
	report.Value("Funds").Array().Element(0).Object().Value("File").Object().ValueEqual("Filename", "fund-b.png")
	report.Value("Funds").Array().Element(0).Object().Value("File").Object().ValueEqual("Uid", fundFileId)

	report.Value("Funds").Array().Element(1).Object().ValueEqual("Name", "LF Equity Income C Acc")
	report.Value("Funds").Array().Element(1).Object().ValueEqual("ExAnteFee", 0.38)
	report.Value("Funds").Array().Element(1).Object().ValueEqual("OcfFee", 0.75)
	report.Value("Funds").Array().Element(1).Object().Value("Modified").String().NotEmpty()
	report.Value("Funds").Array().Element(1).Object().Value("File").Null()

	TestDownload(t, e, ORG1_CLIENT, fundFileId, true)
	TestDownload(t, e, ORG2_CLIENT, fundFileId, false)
	TestDownload(t, e, ORG2_OWNER, fundFileId, false)

	report.Value("PolicyFunds").Array().Length().Equal(2)

	report.Value("PolicyFunds").Array().Element(0).Object().ValueEqual("FundId", fundId1)
	report.Value("PolicyFunds").Array().Element(0).Object().ValueEqual("PolicyId", policyId)
	report.Value("PolicyFunds").Array().Element(0).Object().ValueEqual("Proportion", 0.12)

	report.Value("PolicyFunds").Array().Element(1).Object().ValueEqual("FundId", fundId2)
	report.Value("PolicyFunds").Array().Element(1).Object().ValueEqual("PolicyId", policyId)
	report.Value("PolicyFunds").Array().Element(1).Object().ValueEqual("Proportion", 0.23)

	report.Value("Operators").Array().First().Object().ValueEqual("Fee", 0.0023)
	report.Value("Operators").Array().First().Object().ValueEqual("Name", "FE Invest")
	report.Value("Operators").Array().First().Object().ValueEqual("Type", "dim")
	report.Value("Operators").Array().Length().Equal(1)

	report.Value("Models").Array().First().Object().ValueEqual("Name", "FE Invest Hybrid Risk Level 3 Long")
	report.Value("Models").Array().First().Object().ValueEqual("OperatorId", operatorId)
	report.Value("Models").Array().First().Object().ValueEqual("WeightedExAnteFee", 0.06)
	report.Value("Models").Array().First().Object().ValueEqual("WeightedOcfFee", 0.4)
	//report.Value("Models").Array().First().Object().ValueEqual("File", nil)
	report.Value("Models").Array().Length().Equal(1)

	modelFileId := report.Value("Models").Array().First().Object().Value("File").Object().Value("Uid").String().Raw()
	TestDownload(t, e, ORG1_CLIENT, modelFileId, true)
	TestDownload(t, e, ORG2_CLIENT, modelFileId, false)
	TestDownload(t, e, ORG2_OWNER, modelFileId, false)

	report.Value("Portfolios").Array().First().Object().ValueEqual("ModelId", modelId)
	report.Value("Portfolios").Array().First().Object().ValueEqual("PolicyId", policyId)
	report.Value("Portfolios").Array().First().Object().ValueEqual("Proportion", 0.12)
	report.Value("Portfolios").Array().Length().Equal(1)

	report.Value("RiskProviders").Array().Length().Equal(1)
	report.Value("RiskProviders").Array().First().Object().ValueEqual("Name", "Dynamic Planner")

	report.Value("RiskLevels").Array().Length().Equal(1)
	report.Value("RiskLevels").Array().First().Object().ValueEqual("Label", "Highest")

	report.Value("RiskAssessments").Array().Length().Equal(1)
	report.Value("RiskAssessments").Array().First().Object().ValueEqual("RiskLevelId", riskLevelId)
	report.Value("RiskAssessments").Array().First().Object().ValueEqual("RiskProviderId", riskProviderId)
	report.Value("RiskAssessments").Array().First().Object().Value("File").Object().ValueEqual("Filename", "assessment-c.png")
	TestDownload(t, e, ORG1_CLIENT, assessmentFileId, true)

	report.Value("FactFinds").Array().Length().Equal(1)
	report.Value("FactFinds").Array().First().Object().Value("File").Object().ValueEqual("Filename", "fact-find-c.png")
	TestDownload(t, e, ORG1_CLIENT, factFindFileId, true)

	report.Value("FeesReports").Array().Length().Equal(1)
	report.Value("FeesReports").Array().First().Object().Value("File").Object().ValueEqual("Filename", "sample.png")
	TestDownload(t, e, ORG1_CLIENT, feesReportFileId, true)

	report.Value("Forecasts").Array().Length().Equal(1)
	report.Value("Forecasts").Array().First().Object().Value("File").Object().ValueEqual("Filename", "sample.png")
	TestDownload(t, e, ORG1_CLIENT, forecastFileId, true)
}
