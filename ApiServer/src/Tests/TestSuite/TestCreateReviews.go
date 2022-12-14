package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/Clients/Commands/ReviewModules"
	"testing"
)

func testClientReviews(t *testing.T, e *httpexpect.Expect) {
	testReviews(e)
	testGetClient(t, e)
	testGetClients(e)
	testGetClientSpace(t, e)
}

func testReviews(e *httpexpect.Expect) {
	testCreateReview(e)
	testUpdateReviewModules(e)
	testUpdateReview(e)
	testPublishReview(e)
	testReviewSecurity(e)
}

func testCreateReview(e *httpexpect.Expect) {
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/reviews").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK).JSON().Object()
	reviewId = resp.Value("Id").String().Raw()
}

func testUpdateReview(e *httpexpect.Expect) {
	request := ClientProfile.UpdateReviewRequestBody{
		StartDate: "2006-01-02T15:04:05Z",
		EndDate:   "2006-01-03T15:04:05Z",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/reviews/"+reviewId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testUpdateReviewModules(e *httpexpect.Expect) {
	request := ReviewModules.UpdateReviewModuleRequestBody{
		Intro: "custom intro",
		Text:  "custom text",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/modules/introduction").
		WithHeader("Authentication", ORG1_OWNER).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testPublishReview(e *httpexpect.Expect) {
	e.POST("/api/advisor/clients/"+org1ClientId+"/reviews/"+reviewId+"/publish").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK)
}

func testReviewSecurity(e *httpexpect.Expect) {
	// Modules / Review Modules security
	moduleRequest := ReviewModules.UpdateReviewModuleRequestBody{
		Intro: "hacked",
		Text:  "hacked",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/modules/introduction").
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(moduleRequest).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/modules/introduction/field/all").
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

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

	// Other org advisor
	request := ClientProfile.UpdateReviewRequestBody{
		StartDate: "2006-01-02T15:04:05Z",
		EndDate:   "2006-01-03T15:04:05Z",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/reviews/"+reviewId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/reviews/"+reviewId).
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
	report.Value("ModulePresets").Array().Length().Equal(1)

	modules := report.Value("Modules").Array()
	modules.First().Object().ValueEqual("Type", "introduction")
	modules.First().Object().ValueEqual("Intro", "custom intro")
	modules.First().Object().ValueEqual("Text", "custom text")
	modules.Length().Equal(1)

	report.Value("PolicyTypes").Array().First().Object().ValueEqual("Name", "ISA")

	pp := report.Value("PolicyProviders").Array().First().Object()
	pp.ValueEqual("Name", "Aegon")
	pp.Value("Pricing").String().Contains("tiered charging structure")
	pp.Value("CustomPricing").String().Equal("Custom pricing description")
	report.Value("PolicyProviders").Array().Length().Equal(1)

	pcharges := report.Value("ProviderCharges").Array()
	pcharges.Element(0).Object().Value("Charge").Equal(0.42)
	pcharges.Element(1).Object().Value("Charge").Equal(0.39)
	pcharges.Length().Equal(5)

	pd := report.Value("ProviderDiscounts").Array().First().Object()
	pd.ValueEqual("PolicyProviderId", policyProviderId)
	pd.ValueEqual("Discount", 0.12)
	report.Value("ProviderDiscounts").Array().Length().Equal(1)

	policy := report.Value("Policies").Array().First().Object()
	policy.ValueEqual("ExternalId", "external-pol")
	policy.ValueEqual("MonthlyContributions", 10)
	policy.ValueEqual("StartValue", 100)
	policy.ValueEqual("EndValue", 200)
	policy.ValueEqual("PolicyTypeId", policyTypeId)
	policy.ValueEqual("PolicyProviderId", policyProviderId)
	policy.ValueEqual("Notes", "Policy notes")
	policy.Value("File").Object().ValueEqual("Filename", "policy-b.png")
	report.Value("Policies").Array().Length().Equal(1)

	policyFileIdCopy := report.Value("Policies").Array().First().Object().Value("File").Object().Value("Uid").String().Raw()
	TestDownload(t, e, ORG1_CLIENT, policyFileId, true)
	TestDownload(t, e, ORG2_CLIENT, policyFileId, false)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)
	if policyFileId != policyFileIdCopy {
		t.Fail()
	}

	report.Value("Funds").Array().Length().Equal(2)

	fund1 := report.Value("Funds").Array().Element(0).Object()
	fund1.ValueEqual("Name", "Jupiter Balanced")
	fund1.ValueEqual("ExAnteFee", 0.16)
	fund1.ValueEqual("OcfFee", 0.76)
	fund1.Value("Modified").String().NotEmpty()
	fund1.Value("File").Object().ValueEqual("Filename", "fund-b.png")
	fund1.Value("File").Object().ValueEqual("Uid", fundFileId)

	fund2 := report.Value("Funds").Array().Element(1).Object()
	fund2.ValueEqual("Name", "LF Equity Income C Acc")
	fund2.ValueEqual("ExAnteFee", 0.38)
	fund2.ValueEqual("OcfFee", 0.75)
	fund2.Value("Modified").String().NotEmpty()
	fund2.Value("File").Null()

	TestDownload(t, e, ORG1_CLIENT, fundFileId, true)
	TestDownload(t, e, ORG2_CLIENT, fundFileId, false)
	TestDownload(t, e, ORG2_OWNER, fundFileId, false)

	report.Value("PolicyFunds").Array().Length().Equal(2)

	pf1 := report.Value("PolicyFunds").Array().Element(0).Object()
	pf1.ValueEqual("FundId", fundId1)
	pf1.ValueEqual("PolicyId", policyId)
	pf1.ValueEqual("Proportion", 0.12)

	pf2 := report.Value("PolicyFunds").Array().Element(1).Object()
	pf2.ValueEqual("FundId", fundId2)
	pf2.ValueEqual("PolicyId", policyId)
	pf2.ValueEqual("Proportion", 0.23)

	op := report.Value("Operators").Array().First().Object()
	op.ValueEqual("Fee", 0.0023)
	op.ValueEqual("Name", "FE Invest")
	op.ValueEqual("Type", "dim")
	report.Value("Operators").Array().Length().Equal(1)

	model := report.Value("Models").Array().First().Object()
	model.ValueEqual("Name", "FE Invest Hybrid Risk Level 3 Long")
	model.ValueEqual("OperatorId", operatorId)
	model.ValueEqual("WeightedExAnteFee", 0.06)
	model.ValueEqual("WeightedOcfFee", 0.4)
	report.Value("Models").Array().Length().Equal(1)

	modelFileIdCopy := report.Value("Models").Array().First().Object().Value("File").Object().Value("Uid").String().Raw()
	if modelFileId != modelFileIdCopy {
		t.Fail()
	}
	TestDownload(t, e, ORG1_CLIENT, modelFileIdCopy, true)
	TestDownload(t, e, ORG2_CLIENT, modelFileIdCopy, false)
	TestDownload(t, e, ORG2_OWNER, modelFileIdCopy, false)

	portf := report.Value("Portfolios").Array().First().Object()
	portf.ValueEqual("ModelId", modelId)
	portf.ValueEqual("PolicyId", policyId)
	portf.ValueEqual("Proportion", 0.12)
	report.Value("Portfolios").Array().Length().Equal(1)

	report.Value("RiskProviders").Array().Length().Equal(1)
	report.Value("RiskProviders").Array().First().Object().ValueEqual("Name", "Dynamic Planner")

	report.Value("RiskLevels").Array().Length().Equal(1)
	report.Value("RiskLevels").Array().First().Object().ValueEqual("Label", "Highest")

	report.Value("RiskAssessments").Array().Length().Equal(1)
	riskass := report.Value("RiskAssessments").Array().First().Object()
	riskass.ValueEqual("RiskLevelId", riskLevelId)
	riskass.ValueEqual("RiskProviderId", riskProviderId)
	riskass.Value("File").Object().ValueEqual("Filename", "assessment-c.png")
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
