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
		PolicyProviderId: policyProviderId1Aviva,
		Discount:         0.00000001,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/provider-discounts").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).
		JSON().Object()
	providerDiscountId = resp.Value("Id").String().Raw()

	request.Discount = 0.12 // TODO where does this come from?

	e.PUT("/api/advisor/clients/"+org1ClientId+"/provider-discounts/"+providerDiscountId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
}

func testCreateProviderDiscountSecurity(e *httpexpect.Expect) {
	request := ProviderDiscount.CreateOrUpdateProviderDiscountRequestBody{
		PolicyProviderId: policyProviderId1Aviva,
		Discount:         0.00000001,
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
	// Aviva
	policyId1 = createPolicy(e, policyNumber1, 1000, 0, policy1EndValue, policyTypeId, policyProviderId1Aviva, nil)

	// Aegon
	policyId2 = createPolicy2(t, e)
	policyId3 = createPolicy(e, policyNumber3, 1000, 0, policy3EndValue, policyTypeId, policyProviderId2Aegon, nil)

}

func createPolicy2(t *testing.T, e *httpexpect.Expect) string {
	fileId := TestUpload(t, e, ORG1_ADVISOR, "policy.png")

	policyId := createPolicy(e, policyNumber2, 1000, 20000, 20000, policyTypeId, policyProviderId2Aegon, &Entities.RequestFile{
		Uid:      fileId,
		Filename: "sample.png",
	})

	// Test file download with different user types
	TestDownload(t, e, ORG1_OWNER, fileId, true)
	TestDownload(t, e, ORG1_ADMIN, fileId, true)
	TestDownload(t, e, ORG1_ADVISOR, fileId, true)
	TestDownload(t, e, ORG2_OWNER, fileId, false)
	TestDownload(t, e, ORG1_CLIENT, fileId, true)

	// Remove the file
	request := Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           policyNumber2,
		MonthlyContributions: 1000,
		StartValue:           10000,
		EndValue:             20000,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId2Aegon,
		Notes:                "Policy notes",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
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
		ExternalId:           policyNumber2,
		MonthlyContributions: 1000,
		StartValue:           10000,
		EndValue:             policy2EndValue,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId2Aegon,
		Notes:                "Policy notes",
		File: &Entities.RequestFile{
			Uid:      policyFileId,
			Filename: "sample.png",
		},
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, policyFileId, true)
	TestDownload(t, e, ORG1_ADMIN, policyFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, policyFileId, true)
	TestDownload(t, e, ORG2_OWNER, policyFileId, false)
	TestDownload(t, e, ORG1_CLIENT, policyFileId, true)

	return policyId
}

func createPolicy(e *httpexpect.Expect, policyNumber string, contributions int64, startValue int64, endValue int64, typeId string, providerId2 string, file *Entities.RequestFile) string {
	request := Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           policyNumber,
		MonthlyContributions: contributions,
		StartValue:           startValue,
		EndValue:             endValue,
		PolicyTypeId:         typeId,
		PolicyProviderId:     providerId2,
		Notes:                "Policy notes",
		File:                 file,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policies").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	return resp.JSON().Object().Value("Id").String().Raw()
}

func testCreatePolicySecurity(t *testing.T, e *httpexpect.Expect) {
	request := Policies.CreateOrUpdatePolicyRequestBody{
		ExternalId:           "hacked",
		MonthlyContributions: 1000,
		StartValue:           10000,
		EndValue:             20000,
		PolicyTypeId:         policyTypeId,
		PolicyProviderId:     policyProviderId2Aegon,
		Notes:                "hacked",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId2).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policies/"+policyId2).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testCreatePolicyFunds(e *httpexpect.Expect) {
	testCreatePolicyFundsBasic(e)
	testCreatePolicyFundsSecurity(e)
}

func testCreatePolicyFundsBasic(e *httpexpect.Expect) {
	// Aviva
	policy1FundId1 = createPolicyFund(e, fundId1, policyId1, 0.0000001)
	policy1FundId2 = createPolicyFund(e, fundId2, policyId1, 0.13)
	policy1FundId3 = createPolicyFund(e, fundId3, policyId1, 0.25)
	policy1FundId4 = createPolicyFund(e, fundId4, policyId1, 0.32)
	policy1FundId5 = createPolicyFund(e, fundId5, policyId1, 0.15)

	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId1,
		PolicyId:   policyId1,
		Proportion: 0.15,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policy1FundId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()

	//request = PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
	//	FundId:     fundId1,
	//	PolicyId:   policyId1,
	//	Proportion: 1,
	//}
	//resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policy-funds").
	//	WithHeader("Authentication", ORG1_ADVISOR).
	//	WithJSON(request).
	//	Expect().Status(http.StatusOK).JSON().Object()
	//policy1FundId6 = resp.Value("Id").String().Raw()

	// Aegon
	policy2FundId = createPolicyFund(e, fundId1, policyId2, 1)
}

func createPolicyFund(e *httpexpect.Expect, fundId string, policyId string, proportion float64) string {
	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId,
		PolicyId:   policyId,
		Proportion: proportion,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policy-funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	return resp.Value("Id").String().Raw()
}

func testCreatePolicyFundsSecurity(e *httpexpect.Expect) {
	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId1,
		PolicyId:   policyId1,
		Proportion: 0.0000001,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policy1FundId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policy1FundId1).
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
		PolicyId:   policyId1,
		ModelId:    modelId1, // LGT Vestra Adventurous
		Proportion: 0.00000001,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/portfolios").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	portfolioId1 = resp.Value("Id").String().Raw()

	request.Proportion = 0.6

	e.PUT("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	//
	request = Portfolios.CreateOrUpdatePortfolioRequestBody{
		PolicyId:   policyId1,
		ModelId:    modelId3, // Tatton
		Proportion: 0.4,
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/portfolios").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	portfolioId2 = resp.Value("Id").String().Raw()

	//
	request = Portfolios.CreateOrUpdatePortfolioRequestBody{
		PolicyId:   policyId2,
		ModelId:    modelId2,
		Proportion: 1,
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/portfolios").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	portfolioId3 = resp.Value("Id").String().Raw()
}

func testCreatePortfolioSecurity(e *httpexpect.Expect) {
	request := Portfolios.CreateOrUpdatePortfolioRequestBody{
		PolicyId:   policyId1,
		ModelId:    modelId1,
		Proportion: 0.0000000001,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId1).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}
