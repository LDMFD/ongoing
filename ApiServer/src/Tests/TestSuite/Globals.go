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

	fundName1      = "Jupiter Balanced"
	fundName2      = "Invesco High Income"
	fundName3      = "Fundsmith Equity"
	fundName4      = "Baillie Gifford Japan"
	fundName5      = "Threadneedle US Equity Tracker"
	fundId1        string
	fundId2        string
	fundId3        string
	fundId4        string
	fundId5        string
	fundFileId     string
	policy1FundId1 string
	policy1FundId2 string
	policy1FundId3 string
	policy1FundId4 string
	policy1FundId5 string
	//policy1FundId6 string
	policy2FundId string

	modelId1    string
	modelId2    string
	modelId3    string
	modelFileId string
	modelName1  = "LGT Vestra Adventurous"
	modelName2  = "LGT Vestra Balanced"
	modelName3  = "Tatton Core Active"

	operatorName = "LGT WM"
	operatorId   string

	policyNumber1          = "pol_a"
	policyNumber2          = "pol_b"
	policyNumber3          = "pol_c"
	policyId1              string
	policyId2              string
	policyId3              string
	policyFileId           string
	policyProviderId1Aviva string
	policyProviderId2Aegon string
	policyProviderName1    = "Aviva"
	policyProviderName2    = "Aegon"
	policyTypeId           string
	policy1EndValue        int64 = 534000
	policy2EndValue        int64 = 325000
	policy3EndValue        int64 = 645318

	providerCharges []string

	portfolioId1 string
	portfolioId2 string
	portfolioId3 string

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
