package TestSuite

import (
	"bytes"
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"os"
	"testing"
)

func TestAll(t *testing.T, e *httpexpect.Expect) {
	TestHealthcheck(t, e)
	TestCreationOfOrgsAdvisorsClients(e)
	TestCreateOrgResources(t, e)
	TestCreateHoldings(t, e)
	TestCreateDocuments(t, e)
	TestClientReviews(t, e)
	TestUpdateStaffRoles(t, e)

	if os.Getenv("NO_TEARDOWN") != "true" {
		export(t, e)
		//export := export(t, e)

		TestTeardown(t, e)

		//if err := Importer.ImportFromString(export); err != nil {
		//	t.Error(err)
		//}
		//
		//TestGetGlobalEntitiesFromThisOrg(e)
		//TestGetClient(t, e)
		//TestGetClientSpace(t, e)
	}
}

func export(t *testing.T, e *httpexpect.Expect) string {
	export := TestExport(t, e)
	buf := bytes.NewBufferString(export).Bytes()
	path := os.Getenv("HOME") + "/.ongoing/dumps/tests-export.json"
	if err := os.WriteFile(path, buf, 0644); err != nil {
		t.Error(err)
	}
	return export
}

const API = "http://localhost:8000/api"

func TestHealthcheck(t *testing.T, e *httpexpect.Expect) {
	e.GET("/api/healthcheck").
		Expect().
		Status(http.StatusOK).JSON().Equal("pass")

	//Importer.TestHealthcheck2(t)
}
