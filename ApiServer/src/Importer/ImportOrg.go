package Importer

import (
	"bytes"
	"encoding/json"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Superuser/Commands/Export"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
	"ongoing/Entities"
)

func createOrg(org Export.Org, allUsers []Entities.ReportUser) error {
	var advisorId string

	for _, user := range org.Metadata.Members {
		if user.Role == "owner" {
			advisorId = user.UserId // everything is done under the owner
			break
		}
	}
	var owner Entities.ReportUser
	for _, user := range allUsers {
		if user.Id == advisorId {
			owner = user
			break
		}
	}
	newOrg := Organisation.CreateOrganisationRequestBody{
		Email:     owner.Email,
		Name:      org.Metadata.Name,
		Forenames: owner.Forenames,
		Surname:   owner.Surname, // TODO creator ID
	}

	var ownerId string
	for _, u := range allUsers {
		if u.Email == owner.Email {
			ownerId = u.Id
		}
	}

	if err := importOrganisation(newOrg, ownerId); err != nil {
		return err
	}

	if err := importAdvisors(owner, org, allUsers); err != nil {
		return err
	}

	if err := importClients(&org.Clients, owner, allUsers); err != nil {
		return err
	}

	//if err := importOrgResources(&org.Resources); err != nil {
	//	return err
	//}

	return nil
}

func importOrganisation(mp Organisation.CreateOrganisationRequestBody, ownerId string) error {
	jsonData, _ := json.Marshal(mp)
	request, err := http.NewRequest("POST", API+"/admin/organisations", bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", IMPORT_SUPERUSER)
	request.Header.Set("X-Ongoing-EntityId", ownerId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create org:", mp.Name, resp.Status)
		return errors.New(resp.Status)
	}
	return nil
}
