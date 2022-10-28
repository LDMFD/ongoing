package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"os"
	"testing"
)

func TestAll(t *testing.T, e *httpexpect.Expect) {
	TestHealthcheck(e)
	TestCreationOfOrgsAdvisorsClients(e)
	TestCreateOrgResources(t, e)
	//TestCreateHoldings(t, e)
	//TestCreateDocuments(t, e)
	//TestClientReviews(t, e)
	//TestUpdateStaffRoles(t, e)
	if os.Getenv("NO_TEARDOWN") != "true" {
		TestTeardown(t, e)
	}
}

func TestHealthcheck(e *httpexpect.Expect) {
	e.GET("/api/healthcheck").
		Expect().
		Status(http.StatusOK).JSON().Equal("pass")
}
