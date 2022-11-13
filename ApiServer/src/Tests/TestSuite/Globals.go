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
	reviewId      string

	fundId1       string
	fundId2       string
	fundFileId    string // fund1
	policyFundId1 string // fund1
	policyFundId2 string // fund1

	modelId     string
	modelFileId string

	operatorId string

	policyId         string
	policyFileId     string
	policyProviderId string
	policyTypeId     string

	portfolioId string

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
	reviewId = review.Value("Id").String().Raw()
	report := review.Value("Report").Object()
	policyProviderId = report.Value("PolicyProviders").Array().First().Object().Value("Id").String().Raw()
	policyTypeId = report.Value("PolicyTypes").Array().Element(0).Object().Value("Id").String().Raw()
	fundId1 = report.Value("Funds").Array().Element(0).Object().Value("Id").String().Raw()
	fundId2 = report.Value("Funds").Array().Element(1).Object().Value("Id").String().Raw()
	fundFileId = report.Value("Funds").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	policyId = report.Value("Policies").Array().Element(0).Object().Value("Id").String().Raw()
	policyFileId = report.Value("Policies").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	operatorId = report.Value("Operators").Array().Element(0).Object().Value("Id").String().Raw()
	modelId = report.Value("Models").Array().Element(0).Object().Value("Id").String().Raw()
	modelFileId = report.Value("Models").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	riskLevelId = report.Value("RiskLevels").Array().Element(0).Object().Value("Id").String().Raw()
	riskProviderId = report.Value("RiskProviders").Array().Element(0).Object().Value("Id").String().Raw()
	assessmentFileId = report.Value("RiskAssessments").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	factFindFileId = report.Value("FactFinds").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	feesReportFileId = report.Value("FeesReports").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	forecastFileId = report.Value("Forecasts").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()

	if org1AdvisorId == "" ||
		reviewId == "" ||
		policyProviderId == "" ||
		policyTypeId == "" ||
		fundId1 == "" ||
		fundId2 == "" ||
		fundFileId == "" ||
		policyId == "" ||
		policyFileId == "" ||
		operatorId == "" ||
		modelId == "" ||
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
