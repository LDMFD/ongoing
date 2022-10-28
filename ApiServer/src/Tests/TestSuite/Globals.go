package TestSuite

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
