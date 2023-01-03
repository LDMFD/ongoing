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
	review1Id = resp.Value("Id").String().Raw()

	resp = e.POST("/api/advisor/clients/"+org2ClientId+"/reviews").
		WithHeader("Authentication", ORG2_OWNER).
		Expect().Status(http.StatusOK).JSON().Object()
	review2Id = resp.Value("Id").String().Raw()
}

func testUpdateReview(e *httpexpect.Expect) {
	request := ClientProfile.UpdateReviewRequestBody{
		StartDate: "2006-01-02T15:04:05Z",
		EndDate:   "2006-01-03T15:04:05Z",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/reviews/"+review1Id).
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
	e.POST("/api/advisor/clients/"+org1ClientId+"/reviews/"+review1Id+"/publish").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK)

	e.POST("/api/advisor/clients/"+org2ClientId+"/reviews/"+review2Id+"/publish").
		WithHeader("Authentication", ORG2_OWNER).
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
	e.PUT("/api/advisor/clients/"+org1ClientId+"/reviews/"+review1Id).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/reviews/"+review1Id).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testGetClient(t *testing.T, e *httpexpect.Expect) {
	testGetClientBasic(t, e)
	testGetClientSecurity(t, e)
}

func testGetClientBasic(t *testing.T, e *httpexpect.Expect) {
	// org 1
	obj := e.GET("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK).JSON().Object()

	validateClient1(t, e, obj)

	// org 2
	obj = e.GET("/api/advisor/clients/"+org2ClientId).
		WithHeader("Authentication", ORG2_OWNER).
		Expect().Status(http.StatusOK).JSON().Object()

	validateClient2(t, e, obj)
}

func testGetClientSecurity(t *testing.T, e *httpexpect.Expect) {
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

	validateClient1(t, e, obj)
}

func testOrg2ClientSpace(e *httpexpect.Expect) {
	obj := e.GET("/api/client-space").
		WithHeader("Authentication", ORG2_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object()

	cc := obj.Value("Metadata").Object()
	cc.ValueEqual("Id", org2ClientId)
	cc.ValueEqual("Fee", 0)
	cc.Value("Identity").Object().ValueEqual("Email", ORG2_CLIENT)
	cc.Value("Identity").Object().ValueEqual("Forenames", "Bob")
	cc.Value("Identity").Object().ValueEqual("Surname", "Client")

	obj.Value("Reviews").Array().Length().Equal(1)
}

func validateClient1(t *testing.T, e *httpexpect.Expect, obj *httpexpect.Object) {
	cc := obj.Value("Metadata").Object()
	cc.ValueEqual("Id", org1ClientId)
	cc.ValueEqual("Fee", 0.75)
	cc.Value("Identity").Object().ValueEqual("Email", ORG1_CLIENT)
	cc.Value("Identity").Object().ValueEqual("Forenames", "Adam")
	cc.Value("Identity").Object().ValueEqual("Surname", "Client")

	review := obj.Value("Reviews").Array().First().Object()
	review.ValueEqual("Id", review1Id)

	report := review.Value("Report").Object()
	// "Current state" report doesn't need module presets
	report.Value("ModulePresets").Array().Length().Equal(0)

	modules := report.Value("Modules").Array()
	modules.First().Object().ValueEqual("Type", "introduction")
	modules.First().Object().ValueEqual("Intro", "custom intro")
	modules.First().Object().ValueEqual("Text", "custom text")
	modules.Length().Equal(1)

	report.Value("PolicyTypes").Array().First().Object().ValueEqual("Name", "ISA")

	pp := report.Value("PolicyProviders").Array().First().Object()
	pp.ValueEqual("Name", policyProviderName2)
	pp.Value("Pricing").String().Contains("tiered charging structure")
	pp.Value("CustomPricing").String().Equal("Custom pricing description")
	report.Value("PolicyProviders").Array().Length().Equal(2)

	pcharges := report.Value("ProviderCharges").Array()
	pcharges.Element(0).Object().Value("Charge").Equal(0.42)
	pcharges.Element(1).Object().Value("Charge").Equal(0.39)
	pcharges.Element(2).Object().Value("Charge").Equal(0.35)
	pcharges.Element(3).Object().Value("Charge").Equal(0.32)
	pcharges.Element(4).Object().Value("Charge").Equal(0)
	pcharges.Length().Equal(5)

	pd := report.Value("ProviderDiscounts").Array().First().Object()
	pd.ValueEqual("PolicyProviderId", policyProviderId1Aviva)
	pd.ValueEqual("Discount", 0.12)
	report.Value("ProviderDiscounts").Array().Length().Equal(1)

	policy := report.Value("Policies").Array().Last().Object()
	policy.ValueEqual("ExternalId", policyNumber3)
	policy.ValueEqual("MonthlyContributions", 10)
	policy.ValueEqual("StartValue", 0)
	policy.ValueEqual("EndValue", policy3EndValue)
	policy.ValueEqual("PolicyTypeId", policyTypeId)
	policy.ValueEqual("PolicyProviderId", policyProviderId2Aegon)
	policy.ValueEqual("Notes", "Policy notes")
	policy.Value("File").Null()
	report.Value("Policies").Array().Length().Equal(3)

	policyFileIdCopy := report.Value("Policies").Array().Element(1).Object().Value("File").Object().Value("Uid").String().Raw()
	TestDownload(t, e, ORG1_CLIENT, policyFileId, true)
	TestDownload(t, e, ORG2_CLIENT, policyFileId, false)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)
	if policyFileId != policyFileIdCopy {
		t.Fail()
	}

	report.Value("Funds").Array().Length().Equal(5)

	fund1 := report.Value("Funds").Array().Element(3).Object()
	fund1.ValueEqual("Name", fundName1)
	fund1.ValueEqual("ExAnteFee", 0.16)
	fund1.ValueEqual("OcfFee", 0.76)
	fund1.Value("Modified").String().NotEmpty()
	fund1.Value("File").Object().ValueEqual("Filename", "fund-b.png")
	fund1.Value("File").Object().ValueEqual("Uid", fundFileId)

	fund2 := report.Value("Funds").Array().Element(0).Object()
	fund2.ValueEqual("Name", fundName4)
	fund2.ValueEqual("ExAnteFee", 0.08)
	fund2.ValueEqual("OcfFee", 0.69)
	fund2.Value("Modified").String().NotEmpty()
	fund2.Value("File").Null()

	TestDownload(t, e, ORG1_CLIENT, fundFileId, true)
	TestDownload(t, e, ORG2_CLIENT, fundFileId, false)
	TestDownload(t, e, ORG2_OWNER, fundFileId, false)

	report.Value("PolicyFunds").Array().Length().Equal(6)

	pf1 := report.Value("PolicyFunds").Array().Element(0).Object()
	pf1.ValueEqual("FundId", fundId2)
	pf1.ValueEqual("PolicyId", policyId1)
	pf1.ValueEqual("Proportion", 0.13)

	pf2 := report.Value("PolicyFunds").Array().Element(1).Object()
	pf2.ValueEqual("FundId", fundId1)
	pf2.ValueEqual("PolicyId", policyId1)
	pf2.ValueEqual("Proportion", 0.15)

	op := report.Value("Operators").Array().First().Object()
	op.ValueEqual("Fee", 0.002)
	op.ValueEqual("Name", operatorName)
	op.ValueEqual("Type", "dim")
	report.Value("Operators").Array().Length().Equal(1)

	model := report.Value("Models").Array().First().Object()
	model.ValueEqual("Name", modelName1)
	model.ValueEqual("OperatorId", operatorId)
	model.ValueEqual("WeightedExAnteFee", 0.15)
	model.ValueEqual("WeightedOcfFee", 0.75)
	report.Value("Models").Array().Length().Equal(3)

	modelFileIdCopy := report.Value("Models").Array().First().Object().Value("File").Object().Value("Uid").String().Raw()
	if modelFileId != modelFileIdCopy {
		t.Fail()
	}
	TestDownload(t, e, ORG1_CLIENT, modelFileIdCopy, true)
	TestDownload(t, e, ORG2_CLIENT, modelFileIdCopy, false)
	TestDownload(t, e, ORG2_OWNER, modelFileIdCopy, false)

	portf := report.Value("Portfolios").Array().First().Object()
	portf.ValueEqual("ModelId", modelId3)
	portf.ValueEqual("PolicyId", policyId1)
	portf.ValueEqual("Proportion", 0.4)
	report.Value("Portfolios").Array().Length().Equal(3)

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

func validateClient2(t *testing.T, e *httpexpect.Expect, obj *httpexpect.Object) {
	cc := obj.Value("Metadata").Object()
	cc.ValueEqual("Id", org2ClientId)
	cc.ValueEqual("Fee", 0)
	cc.Value("Identity").Object().ValueEqual("Email", ORG2_CLIENT)

	review := obj.Value("Reviews").Array().First().Object()
	review.ValueEqual("Id", review2Id)
	obj.Value("Reviews").Array().Length().Equal(1)

	report := review.Value("Report").Object()

	report.Value("Funds").Array().Empty()
	report.Value("Models").Array().Empty()
	report.Value("ModulePresets").Array().Empty()
	report.Value("Operators").Array().Empty()
	report.Value("PolicyProviders").Array().Empty()
	report.Value("PolicyTypes").Array().Empty()
	report.Value("Policies").Array().Empty()
	report.Value("ProviderCharges").Array().Empty()
	report.Value("ProviderDiscounts").Array().Empty()
	report.Value("RiskProviders").Array().Empty()
	report.Value("RiskLevels").Array().Empty()
	report.Value("PolicyFunds").Array().Empty()
	report.Value("Portfolios").Array().Empty()
	report.Value("RiskAssessments").Array().Empty()
	report.Value("FactFinds").Array().Empty()
	report.Value("FeesReports").Array().Empty()
	report.Value("Forecasts").Array().Empty()
}
