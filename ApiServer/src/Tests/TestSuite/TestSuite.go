package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

var (
	org1Id        string
	org2Id        string
	org1AdminId   string
	org1AdvisorId string
	org1ClientId  string
	org2ClientId  string
	reviewId      string

	fundId1          string
	fundId2          string
	modelId          string
	operatorId       string
	policyId         string
	policyProviderId string
	policyTypeId     string
)

const (
	SUPERUSER = "darren@amplifa.co.uk"

	ORG1_OWNER   = "org1.boss@amplifa.co.uk"
	ORG1_ADMIN   = "org1.admin@amplifa.co.uk"
	ORG1_ADVISOR = "org1.advisor@amplifa.co.uk"

	ORG2_OWNER = "org2.boss@amplifa.co.uk"

	ORG1_CLIENT = "adam.client@amplifa.co.uk"
	ORG2_CLIENT = "bob.client@amplifa.co.uk"
)

func TestAll(t *testing.T, e *httpexpect.Expect) {
	TestHealthcheck(e)
	TestCreationOfOrgsAdvisorsClients(e)
	TestCreateGlobalEntities(t, e)
	TestCreateHoldings(t, e)
	TestClientReviews(t, e)
	TestUpdateStaffRoles(t, e)
	//TestTeardown(t, e)
}

func TestHealthcheck(e *httpexpect.Expect) {
	e.GET("/api/healthcheck").
		Expect().
		Status(http.StatusOK).JSON().Equal("pass")
}
