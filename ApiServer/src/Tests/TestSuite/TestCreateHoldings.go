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
	CreatePolicyFund(e)
	CreatePortfolio(e)
}

func CreateProviderDiscount(e *httpexpect.Expect) {
	request := ProviderDiscount.CreateOrUpdateProviderDiscountRequestBody{
		PolicyProviderId: policyProviderId,
		Discount:         0.12,
	}
	//resp :=
	e.POST("/api/advisor/clients/"+org1ClientId+"/provider-discounts").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	//.JSON().Object()
	//providerDiscountId = resp.Value("Id").String().Raw()
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
}

func CreatePolicyFund(e *httpexpect.Expect) {
	request := PolicyFunds.CreateOrUpdatePolicyFundRequestBody{
		FundId:     fundId,
		PolicyId:   policyId,
		Proportion: 0.12,
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/policy-funds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK).JSON().Object()
	resp.Value("Id").String()
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
	resp.Value("Id").String()
}
