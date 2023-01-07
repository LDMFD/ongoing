package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

var (
	org1Id        string
	org2Id        string
	org1OwnerId   string
	org1AdminId   string
	org1AdvisorId string
	org1ClientId  string
	org2ClientId  string
	review1Id     string
	review2Id     string

	fundName4  = "Baillie Gifford Japan"
	fundName10 = "BlackRock UK Equity"
	fundName3  = "Fundsmith Equity"
	fundName2  = "Invesco High Income"
	fundName1  = "Jupiter Balanced"
	fundName6  = "Jupiter UK Alpha"
	fundName7  = "Liontrust European Dynamic"
	fundName8  = "Schroder Recovery"
	fundName12 = "Schroder Tokyo"
	fundName5  = "Threadneedle US Equity Tracker"
	fundName9  = "Vanguard Emerging Markets Stock Index"
	fundName11 = "Vanguard European"

	fundId1, fundId2, fundId3, fundId4, fundId5, fundId6    string
	fundId7, fundId8, fundId9, fundId10, fundId11, fundId12 string

	fundFileId     string
	policy1FundId1 string
	policy1FundId2 string
	policy1FundId3 string
	policy1FundId4 string
	policy1FundId5 string

	policy2FundId1 string
	policy2FundId2 string
	policy2FundId3 string
	policy2FundId4 string

	policy3FundId1 string
	policy3FundId2 string
	policy3FundId3 string

	policy4FundId1 string
	policy4FundId2 string
	policy4FundId3 string

	modelId1    string
	modelId2    string
	modelId3    string
	modelId4    string
	modelId5    string
	modelId6    string
	modelId7    string
	modelId8    string
	modelFileId string
	modelName4  = "AJ Bell Active 3"
	modelName5  = "AJ Bell Active 32"
	modelName6  = "Brewin Dolphin Cautious"
	modelName7  = "Brewin Dolphin Passive Plus Growth"
	modelName1  = "LGT Vestra Adventurous"
	modelName2  = "LGT Vestra Balanced"
	modelName3  = "Tatton Core Active"
	modelName8  = "Tatton Ethical Balanced"

	operatorName = "LGT WM"
	operatorId   string

	policyNumber1          = "pol_a"
	policyNumber2          = "pol_b"
	policyNumber3          = "pol_c"
	policyNumber4          = "pol_d"
	policyId1              string
	policyId2              string
	policyId3              string
	policyId4              string
	policyFileId           string
	policyProviderId1Aviva string
	policyProviderId2Aegon string
	policyProviderName1    = "Aviva"
	policyProviderName2    = "Aegon"
	policyTypeId           string
	policy1EndValue        int64 = 1 //53400000
	policy4EndValue        int64 = 1 //87500000
	policy2EndValue        int64 = 32500000
	policy3EndValue        int64 = 64531800

	providerCharges []string

	portfolioId1 string
	portfolioId2 string
	portfolioId3 string
	portfolioId4 string
	portfolioId5 string
	portfolioId6 string
	portfolioId7 string
	portfolioId8 string
	portfolioId9 string

	riskProviderId   string
	riskLevelId      string
	assessmentId     string
	assessmentFileId string

	factFindId     string
	factFindFileId string

	feesReportId     string
	feesReportFileId string

	forecastId     string
	forecastFileId string

	providerDiscountId string
)

const (
	SUPERUSER = "darren@amplifa.co.uk"

	ORG1_OWNER   = "org1.owner@amplifa.co.uk"
	ORG1_ADMIN   = "org1.admin@amplifa.co.uk"
	ORG1_ADVISOR = "org1.advisor@amplifa.co.uk"

	ORG2_OWNER = "org2.owner@amplifa.co.uk"

	ORG1_CLIENT = "adam.client@amplifa.co.uk"
	ORG2_CLIENT = "bob.client@amplifa.co.uk"
)

func setupGlobals(t *testing.T, e *httpexpect.Expect) {
	org1ClientId = e.GET("/api/user/info").
		WithHeader("Authentication", ORG1_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object().Value("ClientId").String().Raw()

	org2ClientId = e.GET("/api/user/info").
		WithHeader("Authentication", ORG2_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object().Value("ClientId").String().Raw()

	obj := e.GET("/api/client-space").
		WithHeader("Authentication", ORG1_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object()

	org1AdvisorId = obj.Value("Metadata").Object().Value("AdvisorId").String().Raw()
	review := obj.Value("Reviews").Array().First().Object()
	review1Id = review.Value("Id").String().Raw()
	report := review.Value("Report").Object()
	policyProviderId1Aviva = report.Value("PolicyProviders").Array().First().Object().Value("Id").String().Raw()
	policyTypeId = report.Value("PolicyTypes").Array().Element(0).Object().Value("Id").String().Raw()
	fundId1 = report.Value("Funds").Array().Element(0).Object().Value("Id").String().Raw()
	fundId2 = report.Value("Funds").Array().Element(1).Object().Value("Id").String().Raw()
	fundFileId = report.Value("Funds").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	policyId1 = report.Value("Policies").Array().Element(0).Object().Value("Id").String().Raw()
	policyFileId = report.Value("Policies").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	operatorId = report.Value("Operators").Array().Element(0).Object().Value("Id").String().Raw()
	modelId1 = report.Value("Models").Array().Element(0).Object().Value("Id").String().Raw()
	modelFileId = report.Value("Models").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	riskLevelId = report.Value("RiskLevels").Array().Element(0).Object().Value("Id").String().Raw()
	riskProviderId = report.Value("RiskProviders").Array().Element(0).Object().Value("Id").String().Raw()
	assessmentFileId = report.Value("RiskAssessments").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	factFindFileId = report.Value("FactFinds").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	feesReportFileId = report.Value("FeesReports").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	forecastFileId = report.Value("Forecasts").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()

	if org1AdvisorId == "" ||
		review1Id == "" ||
		policyProviderId1Aviva == "" ||
		policyTypeId == "" ||
		fundId1 == "" ||
		fundId2 == "" ||
		fundFileId == "" ||
		policyId1 == "" ||
		policyFileId == "" ||
		operatorId == "" ||
		modelId1 == "" ||
		modelFileId == "" ||
		riskLevelId == "" ||
		riskProviderId == "" ||
		assessmentFileId == "" ||
		factFindFileId == "" ||
		feesReportFileId == "" ||
		forecastFileId == "" {
		t.Fail()
	}
}
