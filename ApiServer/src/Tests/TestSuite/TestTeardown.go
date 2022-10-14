package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"testing"
)

func TestTeardown(t *testing.T, e *httpexpect.Expect) {
	TestFundDeletion(t, e)
	TestModelDeletion(t, e)
	TestAccountDeletion(t, e)
}

func TestFundDeletion(t *testing.T, e *httpexpect.Expect) {
	TestDownload(t, e, ORG1_OWNER, fundFileId, true)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/policy-funds/"+policyFundId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/advisor/funds/"+fundId1).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	// Owner can still read the file due to the client review
	TestDownload(t, e, ORG1_OWNER, fundFileId, true)

	// Admin can also read it
	TestDownload(t, e, ORG1_ADMIN, fundFileId, true)

	// Advisors (not of that client) cannot read the file anymore
	TestDownload(t, e, ORG1_ADVISOR, fundFileId, false)
}

func TestModelDeletion(t *testing.T, e *httpexpect.Expect) {
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)

	e.DELETE("/api/advisor/clients/"+org1ClientId+"/portfolios/"+portfolioId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	e.DELETE("/api/advisor/models/"+modelId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	// Owner can still read the file due to the client review
	TestDownload(t, e, ORG1_OWNER, modelFileId, true)

	// Admin can also read it
	TestDownload(t, e, ORG1_ADMIN, modelFileId, true)

	// Advisors (not of that client) cannot read the file anymore
	TestDownload(t, e, ORG1_ADVISOR, modelFileId, false)
}

func TestAccountDeletion(t *testing.T, e *httpexpect.Expect) {
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
