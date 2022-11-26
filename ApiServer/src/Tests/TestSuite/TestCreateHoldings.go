package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/Policies"
	"ongoing/ApiServer/Advisor/Clients/Commands/PolicyFunds"
	"ongoing/ApiServer/Advisor/Clients/Commands/Portfolios"
	"ongoing/ApiServer/Advisor/Clients/Commands/ProviderDiscount"
	"ongoing/Entities"
	"testing"
)

func testCreateHoldings(t *testing.T, e *httpexpect.Expect) {
	testCreateProviderDiscount(e)
	testCreatePolicy(t, e)
	testCreatePolicyFunds(e)
	testCreatePortfolio(e)
}

func testCreateProviderDiscount(e *httpexpect.Expect) {
	testCreateProviderDiscountBasic(e)
	testCreateProviderDiscountSecurity(e)
}

func testCreateProviderDiscountBasic(e *httpexpect.Expect) {
	request := ProviderDiscount.CreateOrUpdateProviderDiscountRequestBody{
		PolicyProviderId: policyProviderId,
		Discount:         0.000000001,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/provider-discounts").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).
		JSON().Object()
	providerDiscountId = resp.Value("Id").String().Raw()

	request.Discount = 0.12

	e.PUT("/api/advisor/clients/"+org1ClientId+"/provider-discounts/"+providerDiscountId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testCreateProviderDiscountSecurity(e *httpexpect.Expect) {
	request := ProviderDiscount.CreateOrUpdateProviderDiscountRequestBody{
		PolicyProviderId: policyProviderId,
		Discount:         0.000000001,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/provider-discounts/"+providerDiscountId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/provider-discounts/"+providerDiscountId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreatePolicy(t *testing.T, e *httpexpect.Expect) {
	testCreatePolicyBasic(t, e)
	testCreatePolicySecurity(t, e)
}

func testCreatePolicyBasic(t *testing.T, e *httpexpect.Expect) {
	fileId := TestUpload(t, e, ORG1_ADVISOR, "policy.png")

	request := Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           "external-pol",
		MonthlyContributions: 10,
		StartValue:           100,
		EndValue:             200,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId,
		Notes:                "Policy notes",
		File: &Entities.RequestFile{
			Uid:      fileId,
			Filename: "sample.png",
		},
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policies").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	policyId = resp.JSON().Object().Value("Id").String().Raw()

	// Test file download with different user types
	TestDownload(t, e, ORG1_OWNER, fileId, true)
	TestDownload(t, e, ORG1_ADMIN, fileId, true)
	TestDownload(t, e, ORG1_ADVISOR, fileId, true)
	TestDownload(t, e, ORG2_OWNER, fileId, false)
	TestDownload(t, e, ORG1_CLIENT, fileId, true)

	// Remove the file
	request = Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           "external-pol",
		MonthlyContributions: 10,
		StartValue:           100,
		EndValue:             200,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId,
		Notes:                "Policy notes",
	}
	resp = e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, fileId, false)
	TestDownload(t, e, ORG1_ADMIN, fileId, false)
	TestDownload(t, e, ORG1_ADVISOR, fileId, false)
	TestDownload(t, e, ORG1_CLIENT, fileId, false)

	// Put the file back again
	policyFileId = TestUpload(t, e, ORG1_ADVISOR, "policy-b.png")

	request = Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           "external-pol",
		MonthlyContributions: 10,
		StartValue:           100,
		EndValue:             200,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId,
		Notes:                "Policy notes",
		File: &Entities.RequestFile{
			Uid:      policyFileId,
			Filename: "sample.png",
		},
	}
	resp = e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, policyFileId, true)
	TestDownload(t, e, ORG1_ADMIN, policyFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, policyFileId, true)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)
	TestDownload(t, e, ORG1_CLIENT, policyFileId, true)
}

func testCreatePolicySecurity(t *testing.T, e *httpexpect.Expect) {
	request := Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           "hacked",
		MonthlyContributions: 10,
		StartValue:           100,
		EndValue:             200,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId,
		Notes:                "hacked",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreatePolicyFunds(e *httpexpect.Expect) {
	testCreatePolicyFundsBasic(e)
	testCreatePolicyFundsSecurity(e)
}

func testCreatePolicyFundsBasic(e *httpexpect.Expect) {
	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId1,
		PolicyId:   policyId,
		Proportion: 0.0000001,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policy-funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	policyFundId1 = resp.Value("Id").String().Raw()

	request.Proportion = 0.12

	e.PUT("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()

	request = PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId2,
		PolicyId:   policyId,
		Proportion: 0.23,
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/policy-funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	policyFundId2 = resp.Value("Id").String().Raw()
}

func testCreatePolicyFundsSecurity(e *httpexpect.Expect) {
	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId1,
		PolicyId:   policyId,
		Proportion: 0.0000001,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

}

func testCreatePortfolio(e *httpexpect.Expect) {
	testCreatePortfolioBasic(e)
	testCreatePortfolioSecurity(e)
}

func testCreatePortfolioBasic(e *httpexpect.Expect) {
	request := Portfolios.CreateOrUpdatePortfolioRequestBody{
		PolicyId:   policyId,
		ModelId:    modelId,
		Proportion: 0.0000000001,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/portfolios").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	portfolioId = resp.Value("Id").String().Raw()

	request.Proportion = 0.12

	e.PUT("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testCreatePortfolioSecurity(e *httpexpect.Expect) {
	request := Portfolios.CreateOrUpdatePortfolioRequestBody{
		PolicyId:   policyId,
		ModelId:    modelId,
		Proportion: 0.0000000001,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}
