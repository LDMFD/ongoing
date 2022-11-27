package TestSuite

import (
	"bytes"
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"os"
	"testing"
)

func TestAll(t *testing.T, e *httpexpect.Expect) {
	testHealthcheck(t, e)

	if os.Getenv("VALIDATION_ONLY") == "true" {
		setupGlobals(t, e)
		runValidationTests(t, e)
		return
	}

	runFullTestSuite(t, e)

	export(t, e)

	if os.Getenv("NO_TEARDOWN") != "true" {
		testTeardown(t, e)
	}
}

func runFullTestSuite(t *testing.T, e *httpexpect.Expect) {
	testCreationOfOrgsAdvisorsClients(e)
	testCreateOrgResources(t, e)
	testCreateHoldings(t, e)
	testCreateDocuments(t, e)
	testClientReviews(t, e)
	testUpdateStaffRoles(t, e)
}

func runValidationTests(t *testing.T, e *httpexpect.Expect) {
	testGetOrgResourcesFromThisOrg(e)
	testGetClient(t, e)
	testGetClientSpace(t, e)
}

func export(t *testing.T, e *httpexpect.Expect) string {
	export := testExport(t, e)
	buf := bytes.NewBufferString(export).Bytes()
	path := os.Getenv("HOME") + "/.ongoing/dumps/tests-export.json"
	if err := os.WriteFile(path, buf, 0644); err != nil {
		t.Error(err)
	}
	return export
}

func testHealthcheck(t *testing.T, e *httpexpect.Expect) {
	e.GET("/api/healthcheck").
		Expect().
		Status(http.StatusOK)
}
