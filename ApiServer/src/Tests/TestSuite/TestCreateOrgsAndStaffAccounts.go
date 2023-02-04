package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	ClientProfileCommands "ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/ApiServer/Advisor/OrgAdmin/Commands"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
	"ongoing/Entities"
)

func testCreationOfOrgsAdvisorsClients(e *httpexpect.Expect) {
	testCreateOrgs(e)
	testCreateAdvisors(e)
	testCreateClients(e)
	testGetAdvisors(e)
	testUserInfo(e)
	testUpdateOrg(e)
}

func testCreateOrgs(e *httpexpect.Expect) {
	// Create org 1
	org1spec := map[string]interface{}{
		"Email":     ORG1_OWNER,
		"Name":      Org1Name,
		"Surname":   OwnerOwenSurname,
		"Forenames": OwnerOwenForename,
	}

	org1 := e.POST("/api/admin/organisations").
		WithHeader("Authentication", SUPERUSER).
		WithJSON(org1spec).Expect().
		Status(http.StatusOK).JSON().Object()

	org1Id = org1.Value("Id").String().Raw()
	org1OwnerId = org1.Value("OwnerId").String().Raw()

	// Names must be unique
	e.POST("/api/admin/organisations").
		WithHeader("Authentication", SUPERUSER).
		WithJSON(org1spec).Expect().
		Status(http.StatusBadRequest).
		JSON().Object().ValueEqual("error", "Organisation names must be globally unique.")

	// Create org 2
	org2spec := map[string]interface{}{
		"Email":     ORG2_OWNER,
		"Name":      "Boring & Co.",
		"Forenames": OwnerPatrickForename,
		"Surname":   OwnerPatrickSurname,
	}
	org2 := e.POST("/api/admin/organisations").
		WithHeader("Authentication", SUPERUSER).
		WithJSON(org2spec).Expect().
		Status(http.StatusOK).JSON().Object()
	org2Id = org2.Value("Id").String().Raw()
}

func testCreateAdvisors(e *httpexpect.Expect) {
	testCreateAdvisorsBasic(e)
	testCreateAdvisorsSecurity(e)
}

func testCreateAdvisorsBasic(e *httpexpect.Expect) {
	// Create second advisor (first non-owner) in org 1
	newAdvisorSpec := Commands.CreateAdvisorRequestBody{
		Email:     ORG1_ADMIN,
		Forenames: AdvisorCharlesForename,
		Surname:   AdvisorCharlesSurname,
		Role:      Entities.UserTypeOrgAdmin,
	}
	org1AdminId = e.POST("/api/staff").
		WithHeader("Authentication", ORG1_OWNER).
		WithJSON(newAdvisorSpec).Expect().
		Status(http.StatusOK).JSON().Object().Value("Id").String().Raw()

	// Third advisor (non-admin) in org 1, using admin account
	newAdvisorSpec = Commands.CreateAdvisorRequestBody{
		Email:     ORG1_ADVISOR,
		Forenames: AdvisorDavidForename,
		Surname:   AdvisorDavidSurname,
		Role:      Entities.UserTypeAdvisor,
	}
	org1AdvisorId = e.POST("/api/staff").
		WithHeader("Authentication", ORG1_ADMIN).
		WithJSON(newAdvisorSpec).Expect().
		Status(http.StatusOK).JSON().Object().Value("Id").String().Raw()

	// Staff account creation using regular advisor account shouldn't be allowed
	newAdvisorSpec = Commands.CreateAdvisorRequestBody{
		Email:     "irrelevant@tp1.org",
		Forenames: AdvisorEliotForename,
		Surname:   "None",
		Role:      Entities.UserTypeAdvisor,
	}
	e.POST("/api/staff").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(newAdvisorSpec).Expect().
		Status(http.StatusForbidden)
}

func testCreateAdvisorsSecurity(e *httpexpect.Expect) {
	newAdvisorSpec := Commands.UpdateAdvisorRequestBody{
		Email:     ORG1_ADMIN,
		Forenames: AdvisorCharlesForename,
		Surname:   AdvisorCharlesSurname,
		Role:      Entities.UserTypeOrgAdmin,
	}
	e.PUT("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(newAdvisorSpec).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/staff/"+org1AdvisorId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testGetAdvisors(e *httpexpect.Expect) {
	info := e.GET("/api/staff").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK).JSON().Object().Value("Advisors").Array()
	info.Length().Equal(3)
	info.Element(0).Object().ValueEqual("Email", ORG1_ADMIN)
	info.Element(0).Object().ValueEqual("Role", "administrator")
	info.Element(1).Object().ValueEqual("Email", ORG1_ADVISOR)
	info.Element(1).Object().ValueEqual("Role", "advisor")
	info.Element(2).Object().ValueEqual("Email", ORG1_OWNER)
	info.Element(2).Object().ValueEqual("Role", "owner")

	e.GET("/api/staff").
		WithHeader("Authentication", ORG1_ADMIN).
		Expect().Status(http.StatusOK).JSON().Object().Value("Advisors").Array()

	e.GET("/api/staff").
		WithHeader("Authentication", SUPERUSER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

	// TODO multi-org allow membership in multiple orgs - test cross-org access doesn't work

	e.GET("/api/staff").
		WithHeader("Authentication", ORG1_CLIENT).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)

}

func testCreateClients(e *httpexpect.Expect) {
	org1ClientId = createClient(e, ORG1_ADMIN, ORG1_CLIENT, ClientAdamForename, ClientAdamSurname, 0.75)
	org2ClientId = createClient(e, ORG2_OWNER, ORG2_CLIENT, ClientBobForename, ClientBobSurname, 0) // Test zero fee
	testUpdateClientSecurity(e)
}

func createClient(e *httpexpect.Expect, owner, email, forename, surname string, fee float64) string {
	client := ClientProfileCommands.CreateOrUpdateClientRequestBody{
		Identity: struct {
			Forenames string `binding:"required"`
			Surname   string `binding:"required"`
			Email     string `binding:"required"`
		}{
			Forenames: forename,
			Surname:   "wrong",
			Email:     email,
		},
		Fee: fee,
	}

	resp := e.POST("/api/advisor/clients").
		WithHeader("Authentication", owner).
		WithJSON(client).Expect().
		Status(http.StatusOK).JSON().Object()

	clientId := resp.Value("Id").String().Raw()

	client.Identity.Surname = surname

	e.PUT("/api/advisor/clients/"+clientId).
		WithHeader("Authentication", owner).
		WithJSON(client).Expect().
		Status(http.StatusOK)

	return clientId
}

func testUpdateClientSecurity(e *httpexpect.Expect) {
	client := ClientProfileCommands.CreateOrUpdateClientRequestBody{
		Identity: struct {
			Forenames string `binding:"required"`
			Surname   string `binding:"required"`
			Email     string `binding:"required"`
		}{
			Forenames: "spam",
			Surname:   "spam",
			Email:     "spam@example.com",
		},
		Fee: 0.12,
	}
	e.PUT("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(client).
		Expect().Status(http.StatusForbidden)

	e.DELETE("/api/advisor/clients/"+org1ClientId).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		Expect().Status(http.StatusForbidden)
}

func testUserInfo(e *httpexpect.Expect) {
	info := e.GET("/api/user/info").
		WithHeader("Authentication", SUPERUSER).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object()
	info.ValueEqual("Email", SUPERUSER)
	info.ValueEqual("OrgId", nil)
	info.ValueEqual("Role", "superuser")

	info = e.GET("/api/user/info").
		WithHeader("Authentication", ORG1_OWNER).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object()
	info.ValueEqual("Email", ORG1_OWNER)
	info.ValueEqual("OrgId", org1Id)
	info.ValueEqual("Role", "owner")

	info = e.GET("/api/user/info").
		WithHeader("Authentication", ORG1_ADMIN).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object()
	info.ValueEqual("Email", ORG1_ADMIN)
	info.ValueEqual("OrgId", org1Id)
	info.ValueEqual("Role", "administrator")

	info = e.GET("/api/user/info").
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object()
	info.ValueEqual("Email", ORG1_ADVISOR)
	info.ValueEqual("OrgId", org1Id)
	info.ValueEqual("Role", "advisor")

	info = e.GET("/api/user/info").
		WithHeader("Authentication", ORG1_CLIENT).
		Expect().Status(http.StatusOK).JSON().Object().Value("Context").Object()
	info.ValueEqual("Email", ORG1_CLIENT)
	info.ValueEqual("OrgId", org1Id)
	info.ValueEqual("Role", "client")
}

func testUpdateOrg(e *httpexpect.Expect) {
	// Rename org (as the superuser)
	request := Organisation.UpdateOrganisationRequestBody{Name: "org1b"}
	e.PUT("/api/admin/organisations/"+org1Id).
		WithHeader("Authentication", SUPERUSER).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Rename org (as the owner)
	request = Organisation.UpdateOrganisationRequestBody{Name: Org1Name}
	e.PUT("/api/advisor/organisations/"+org1Id).
		WithHeader("Authentication", ORG1_OWNER).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Rename org (as the client) - forbidden
	request = Organisation.UpdateOrganisationRequestBody{Name: "org1d"}
	e.PUT("/api/advisor/organisations/"+org1Id).
		WithHeader("Authentication", ORG1_CLIENT).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)

	// Rename org (as the owner of another org) - forbidden
	request = Organisation.UpdateOrganisationRequestBody{Name: "org1e"}
	e.PUT("/api/advisor/organisations/"+org1Id).
		WithHeader("Authentication", ORG2_OWNER).
		WithHeader("X-Ongoing-ExpectForbidden", "true").
		WithJSON(request).
		Expect().Status(http.StatusForbidden)
}
