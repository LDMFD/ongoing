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

	Org1Name = "ACME, Inc."

	ClientAdamForename = "Adam"
	ClientAdamSurname  = "Black"
	ClientBobForename  = "Bob"
	ClientBobSurname   = "Deacon"

	AdvisorCharlesForename = "Charles"
	AdvisorCharlesSurname  = "Perkins"
	AdvisorDavidForename   = "David"
	AdvisorDavidSurname    = "Archer"
	AdvisorEliotForename   = "Eliot"
	AdvisorEliotSurname    = "Oakley"
	AdvisorFredForename    = "Fred"
	AdvisorFredSurname     = "Cook"

	OwnerOwenForename    = "Owen"
	OwnerOwenSurname     = "Eastwood"
	OwnerPatrickForename = "Patrick"
	OwnerPatrickSurname  = "Fitzroy"

	fundNameBaillie          = "Baillie Gifford Japan"
	fundNameBlackrock        = "BlackRock UK Equity"
	fundNameFundsmith        = "Fundsmith Equity"
	fundNameInvesco          = "Invesco High Income"
	fundNameJupiterBalanced  = "Jupiter Balanced"
	fundNameJupiterUKAlpha   = "Jupiter UK Alpha"
	fundNameLiontrust        = "Liontrust European Dynamic"
	fundNameSchroderRecovery = "Schroder Recovery"
	fundNameSchroderTokyo    = "Schroder Tokyo"
	fundNameThreadneedle     = "Threadneedle US Equity Tracker"
	fundNameVanguardEmerging = "Vanguard Emerging Markets Stock Index"
	fundNameVanguardEuropean = "Vanguard European"

	fundIdJupiterBalanced, fundIdInvesco, fundIdFundsmith, fundIdBaillie, fundIdThreadneedle, fundIdJupiterAlpha                   string
	fundIdLionTrust, fundIdSchroderDiscovery, fundIdVanguardEmerging, fundIdBlackrock, fundIdVanguardEuropean, fundIdSchroderTokyo string

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

	modelId1                       string
	modelId2                       string
	modelId3                       string
	modelId4                       string
	modelId5                       string
	modelId6                       string
	modelId7                       string
	modelId8                       string
	modelFileId                    string
	modelNameAJBell3               = "AJ Bell Active 3"
	modelNameAJBell32              = "AJ Bell Active 32"
	modelNameBrewinCautious        = "Brewin Dolphin Cautious"
	modelNameBrewinPassive         = "Brewin Dolphin Passive Plus Growth"
	modelNameLgtVestraAdventurous  = "LGT Vestra Adventurous"
	modelNameLgtVestraBalanced     = "LGT Vestra Balanced"
	modelNameTattonCoreActive      = "Tatton Core Active"
	modelNameTattonEthicalBalanced = "Tatton Ethical Balanced"

	operatorNameAJBell     = "AJ Bell"
	operatorNameBrewin     = "Brewin Dolphin"
	operatorNameLgtWM      = "LGT WM"
	operatorNameTattonCore = "Tatton Core"
	operatorIdAJBell       string
	operatorIdBrewin       string
	operatorIdLgtWM        string
	operatorIdTattonCore   string

	operatorAJFee = 0.15

	policyNumber1           = "P0L-A"
	policyNumber2           = "P0L-B"
	policyNumber3           = "P0L-C"
	policyNumber4           = "P0L-D"
	policyId1               string
	policyId2               string
	policyId3               string
	policyId4               string
	policyFileId            string
	policyProviderId1Aviva  string
	policyProviderId2Aegon  string
	policyProviderNameAviva = "Aviva"
	policyProviderNameAegon = "Aegon"
	policyTypeId            string
	policy1EndValue         int64 = 1 //53400000
	policy4EndValue         int64 = 1 //87500000
	policy2EndValue         int64 = 32500000
	policy3EndValue         int64 = 64531800

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

	ORG1_CLIENT = "adam.black@amplifa.co.uk"
	ORG2_CLIENT = "bob.deacon@amplifa.co.uk"
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
	fundIdJupiterBalanced = report.Value("Funds").Array().Element(0).Object().Value("Id").String().Raw()
	fundIdInvesco = report.Value("Funds").Array().Element(1).Object().Value("Id").String().Raw()
	fundFileId = report.Value("Funds").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	policyId1 = report.Value("Policies").Array().Element(0).Object().Value("Id").String().Raw()
	policyFileId = report.Value("Policies").Array().Element(0).Object().Value("File").Object().Value("Uid").String().Raw()
	operatorIdAJBell = report.Value("Operators").Array().Element(0).Object().Value("Id").String().Raw()
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
		fundIdJupiterBalanced == "" ||
		fundIdInvesco == "" ||
		fundFileId == "" ||
		policyId1 == "" ||
		policyFileId == "" ||
		operatorIdAJBell == "" ||
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
