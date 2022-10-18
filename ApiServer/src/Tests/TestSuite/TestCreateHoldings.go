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

func TestCreateHoldings(t *testing.T, e *httpexpect.Expect) {
	CreateProviderDiscount(e)
	CreatePolicy(t, e)
	CreatePolicyFunds(e)
	CreatePortfolio(e)
}

func CreateProviderDiscount(e *httpexpect.Expect) {
	request := ProviderDiscount.CreateOrUpdateProviderDiscountRequestBody{
		PolicyProviderId: policyProviderId,
		Discount:         0.12,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/provider-discounts").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).
		JSON().Object()
	providerDiscountId = resp.Value("Id").String().Raw()
}

func CreatePolicy(t *testing.T, e *httpexpect.Expect) {
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
	fileId = TestUpload(t, e, ORG1_ADVISOR, "policy-b.png")

	request = Policies.CreateOrUpdatePolicyRequestBody{
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
	resp = e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, fileId, true)
	TestDownload(t, e, ORG1_ADMIN, fileId, true)
	TestDownload(t, e, ORG1_ADVISOR, fileId, true)
	TestDownload(t, e, ORG2_OWNER, fileId, false)
	TestDownload(t, e, ORG1_CLIENT, fileId, true)
}

func CreatePolicyFunds(e *httpexpect.Expect) {
	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId1,
		PolicyId:   policyId,
		Proportion: 0.12,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policy-funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	policyFundId1 = resp.Value("Id").String().Raw()

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

func CreatePortfolio(e *httpexpect.Expect) {
	request := Portfolios.CreateOrUpdatePortfolioRequestBody{
		PolicyId:   policyId,
		ModelId:    modelId,
		Proportion: 0.12,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/portfolios").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	portfolioId = resp.Value("Id").String().Raw()
}
