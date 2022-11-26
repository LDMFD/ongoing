package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"ongoing/ApiServer/Advisor/OrgAdmin/Commands"
	"ongoing/Entities"
	"testing"
)

func testUpdateStaffRoles(t *testing.T, e *httpexpect.Expect) {
	testUpdateStaffRolesBasic(t, e)
	testUpdateStaffRolesSecurity(t, e)
}

func testUpdateStaffRolesBasic(t *testing.T, e *httpexpect.Expect) {
	// As admin 1, promote org 1 advisor to org 1 admin
	request := Commands.CreateAdvisorRequestBody{
		Role:    Entities.UserTypeOrgAdmin,
		Surname: "boss",
	}
	e.PUT("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG1_ADMIN).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// As admin 1, demote the same user back to advisor
	request = Commands.CreateAdvisorRequestBody{
		Role: Entities.UserTypeAdvisor,
	}
	e.PUT("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG1_ADMIN).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Change org 1's advisor's name and email
	request2 := Commands.UpdateAdvisorRequestBody{
		Email:     "org1.advisor2@tp1.org",
		Forenames: "Adele",
		Surname:   "Advisor",
		Role:      "advisor",
	}
	e.PUT("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG1_ADMIN).
		WithJSON(request2).
		Expect().Status(http.StatusOK)

	// Change it back again
	request2 = Commands.UpdateAdvisorRequestBody{
		Email:     ORG1_ADVISOR,
		Forenames: "Adele",
		Surname:   "Advisor",
		Role:      "advisor",
	}
	e.PUT("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG1_ADMIN).
		WithJSON(request2).
		Expect().Status(http.StatusOK)
}

func testUpdateStaffRolesSecurity(t *testing.T, e *httpexpect.Expect) {
	// As org 1 advisor, cannot promote self
	request := Commands.CreateAdvisorRequestBody{
		Role: Entities.UserTypeOrgAdmin,
	}
	e.PUT("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	// As org 1 advisor, cannot demote other user
	request = Commands.CreateAdvisorRequestBody{
		Role: Entities.UserTypeOrgAdmin,
	}
	e.PUT("/api/staff/"+org1AdminId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	// As admin, cannot promote client
	request = Commands.CreateAdvisorRequestBody{
		Role: Entities.UserTypeAdvisor,
	}
	e.PUT("/api/staff/"+org1ClientId).
		WithHeader("Authentication", ORG1_ADMIN).
		WithJSON(request).
		Expect().Status(http.StatusBadRequest)

	// As client, cannot promote self
	request = Commands.CreateAdvisorRequestBody{
		Role: Entities.UserTypeAdvisor,
	}
	e.PUT("/api/staff/"+org1ClientId).
		WithHeader("Authentication", ORG1_CLIENT).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

}
