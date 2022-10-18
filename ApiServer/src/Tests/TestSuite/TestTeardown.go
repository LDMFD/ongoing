package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

func TestTeardown(t *testing.T, e *httpexpect.Expect) {
	TestDeleteClientHoldings(t, e)
	TestDeleteOrgResources(t, e)
	TestDeleteAccounts(t, e)
}

func TestDeleteAccounts(t *testing.T, e *httpexpect.Expect) {
	e.DELETE("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG1_ADMIN).
		Expect().Status(http.StatusOK)

	// TODO this is not ideal - should be BadRequest so an attacker can't prove the existence of an account
	e.DELETE("/api/advisor/clients/"+org2ClientId).
		WithHeader("Authentication", ORG1_ADMIN).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/xxx").
		WithHeader("Authentication", ORG1_ADMIN).
		Expect().Status(http.StatusBadRequest)

	e.DELETE("/api/advisor/clients/"+org2ClientId).
		WithHeader("Authentication", ORG2_OWNER).
		Expect().Status(http.StatusOK)

	e.GET("/api/admin/stats").
		WithHeader("Authentication", SUPERUSER).
		Expect().Status(http.StatusOK).JSON().Object() //.ValueEqual("Rows", 0)
}
