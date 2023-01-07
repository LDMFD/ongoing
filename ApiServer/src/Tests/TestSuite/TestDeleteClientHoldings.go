package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

func testDeleteClientHoldings(t *testing.T, e *httpexpect.Expect) {
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

func testDeleteReviews(t *testing.T, e *httpexpect.Expect) {
	// org 1
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/modules/introduction/field/all").
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/reviews/"+review1Id).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	// org 2
	e.DELETE("/api/advisor/clients/"+org2ClientId+"/reviews/"+review2Id).
		WithHeader("Authentication", ORG2_OWNER).
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
	deletePortfolio(e, portfolioId1)
	deletePortfolio(e, portfolioId2)
	deletePortfolio(e, portfolioId3)
	deletePortfolio(e, portfolioId4)
	deletePortfolio(e, portfolioId5)
	deletePortfolio(e, portfolioId6)
	deletePortfolio(e, portfolioId7)
	deletePortfolio(e, portfolioId8)
	deletePortfolio(e, portfolioId9)
}

func deletePortfolio(e *httpexpect.Expect, portfolioId string) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeletePolicyFunds(t *testing.T, e *httpexpect.Expect) {
	deletePolicyFund(e, policy1FundId1)
	deletePolicyFund(e, policy1FundId2)
	deletePolicyFund(e, policy1FundId3)
	deletePolicyFund(e, policy1FundId4)
	deletePolicyFund(e, policy1FundId5)
	deletePolicyFund(e, policy2FundId1)
	deletePolicyFund(e, policy2FundId2)
	deletePolicyFund(e, policy2FundId3)
	deletePolicyFund(e, policy2FundId4)
	deletePolicyFund(e, policy3FundId1)
	deletePolicyFund(e, policy3FundId2)
	deletePolicyFund(e, policy3FundId3)
	deletePolicyFund(e, policy4FundId1)
	deletePolicyFund(e, policy4FundId2)
	deletePolicyFund(e, policy4FundId3)
}

func deletePolicyFund(e *httpexpect.Expect, policyFundId string) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeletePolicies(t *testing.T, e *httpexpect.Expect) {
	deletePolicy(e, policyId1)
	deletePolicy(e, policyId2)
	deletePolicy(e, policyId3)
	deletePolicy(e, policyId4)

	TestDownload(t, e, ORG1_OWNER, policyFileId, false)
	TestDownload(t, e, ORG1_ADMIN, policyFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, policyFileId, false)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)
	TestDownload(t, e, ORG1_CLIENT, policyFileId, false)
}

func deletePolicy(e *httpexpect.Expect, policyId string) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}

func TestDeleteProviderDiscounts(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/provider-discounts/"+providerDiscountId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)
}
