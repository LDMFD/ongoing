package Importer

import (
	"bytes"
	"encoding/json"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/OrgAdmin/Commands"
	"ongoing/ApiServer/Superuser/Commands/Export"
	"ongoing/Entities"
)

func importAdvisors(owner Entities.ReportUser, org Export.Org, allUsers []Entities.ReportUser) error {
	for _, user := range org.Metadata.Members {
		if user.Role == "advisor" || user.Role == "administrator" {
			for _, identity := range allUsers {
				if identity.Id == user.UserId {
					if err := createAdvisor(owner, user, identity); err != nil {
						return err
					}
				}
			}
			break
		}
	}
	return nil
}

func createAdvisor(owner Entities.ReportUser, user Entities.OrganisationMember, identity Entities.ReportUser) error {
	requestBody := Commands.CreateAdvisorRequestBody{
		Email:     identity.Email,
		Forenames: identity.Forenames,
		Surname:   identity.Surname,
		Role:      user.Role,
	}
	log.Println(requestBody)

	requestJson, _ := json.Marshal(requestBody)
	request, err := http.NewRequest("POST", API+"/staff", bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("X-Ongoing-EntityId-user", identity.Id)
	request.Header.Set("X-Ongoing-EntityId-advisor", user.UserId)
	request.Header.Set("Authentication", owner.Email)
	//request.Header.Set("X-ViewAs", owner.Id)

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
