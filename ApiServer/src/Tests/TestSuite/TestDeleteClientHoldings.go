package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

func TestDeleteClientHoldings(t *testing.T, e *httpexpect.Expect) {
	TestDeleteReviews(t, e)
	TestDeleteDocuments(t, e)
	TestDeleteHoldings(t, e)
}

func TestDeleteDocuments(t *testing.T, e *httpexpect.Expect) {
	TestDeleteForecasts(t, e)
	TestDeleteFeesReports(t, e)
	TestDeleteFactFinds(t, e)
	TestDeleteRiskAssessments(t, e)
}

func TestDeleteHoldings(t *testing.T, e *httpexpect.Expect) {
	TestDeletePortfolios(t, e)
	TestDeletePolicyFunds(t, e)
	TestDeletePolicies(t, e)
	TestDeleteProviderDiscounts(t, e)
}

func TestDeleteReviews(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/reviews/"+reviewId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteForecasts(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/forecasts/"+forecastId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, forecastFileId, false)
	TestDownload(t, e, ORG1_ADMIN, forecastFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, forecastFileId, false)
	TestDownload(t, e, ORG1_CLIENT, forecastFileId, false)
}

func TestDeleteFeesReports(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/fees-reports/"+feesReportId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, feesReportFileId, false)
	TestDownload(t, e, ORG1_ADMIN, feesReportFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, feesReportFileId, false)
	TestDownload(t, e, ORG1_CLIENT, feesReportFileId, false)
}

func TestDeleteFactFinds(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/fact-finds/"+factFindId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, factFindFileId, false)
	TestDownload(t, e, ORG1_ADMIN, factFindFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, factFindFileId, false)
	TestDownload(t, e, ORG1_CLIENT, factFindFileId, false)
}

func TestDeleteRiskAssessments(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/risk-assessments/"+assessmentId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, assessmentFileId, false)
	TestDownload(t, e, ORG1_ADMIN, assessmentFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, assessmentFileId, false)
	TestDownload(t, e, ORG1_CLIENT, assessmentFileId, false)
}

func TestDeletePortfolios(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeletePolicyFunds(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId2).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeletePolicies(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, policyFileId, false)
	TestDownload(t, e, ORG1_ADMIN, policyFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, policyFileId, false)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)
	TestDownload(t, e, ORG1_CLIENT, policyFileId, false)
}

func TestDeleteProviderDiscounts(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/provider-discounts/"+providerDiscountId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}
