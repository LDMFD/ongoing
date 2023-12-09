package Importer

import (
	"bytes"
	"encoding/json"
	"github.com/pkg/errors"
	"net/http"
	"ongoing/ApiServer/Advisor/Staff/Commands"
	"ongoing/Config"
	"ongoing/Entities"
)

func importAdvisors(owner Entities.ReportUser, org Entities.Org, allUsers []Entities.ReportUser) error {
	for _, member := range org.Metadata.Members {
		if member.Role == "advisor" || member.Role == "administrator" {
			for _, user := range allUsers {
				if user.Id == member.UserId {
					if err := importAdvisor(owner, member, user); err != nil {
						return err
					}
				}
			}
		}
	}
	return nil
}

func importAdvisor(owner Entities.ReportUser, user Entities.OrganisationMember, identity Entities.ReportUser) error {
	requestBody := Commands.CreateAdvisorRequestBody{
		Email:     identity.Email,
		Forenames: identity.Forenames,
		Surname:   identity.Surname,
		Role:      user.Role,
	}

	requestJson, _ := json.Marshal(requestBody)
	request, err := http.NewRequest("POST", API+"/staff", bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("X-Ongoing-EntityId-user", identity.Id)
	request.Header.Set("X-Ongoing-EntityId-advisor", user.UserId)
	request.Header.Set(Config.ApiKeyHeaderName, Config.API_KEY)
	request.Header.Set("Authentication", owner.Id)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return errors.New(resp.Status)
	}
	return nil
}
