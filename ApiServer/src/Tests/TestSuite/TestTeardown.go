package TestSuite

import (
	"encoding/json"
	"fmt"
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

func testExport(t *testing.T, e *httpexpect.Expect) string {
	obj := e.GET("/api/admin/export").
		WithHeader("Authentication", SUPERUSER).
		Expect().Status(http.StatusOK).JSON().Object().Raw()
	b, err := json.MarshalIndent(obj, "", "  ")
	if err != nil {
		fmt.Println(err)
		panic(err)
	}
	return string(b)
}

func testTeardown(t *testing.T, e *httpexpect.Expect) {
	testDeleteClientHoldings(t, e)
	testDeleteReviews(t, e)
	testDeleteOrgResources(t, e)
	testDeleteAccounts(t, e)
}

func testDeleteAccounts(t *testing.T, e *httpexpect.Expect) {
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

	e.DELETE("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG1_ADMIN).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/staff/"+org1AdminId).
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/admin/organisations/"+org2Id).
		WithHeader("Authentication", SUPERUSER).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/admin/organisations/"+org1Id).
		WithHeader("Authentication", SUPERUSER).
		Expect().Status(http.StatusOK)

	e.GET("/api/admin/stats").
		WithHeader("Authentication", SUPERUSER).
		Expect().Status(http.StatusOK).JSON().Object().ValueEqual("Rows", 2) // 2 superusers
}
