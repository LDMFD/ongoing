package Importer

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer/Helpers"
	"ongoing/ApiServer/Superuser/Commands/Export"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
	"ongoing/Database"
	"ongoing/Entities"
	"os"
)

var (
	importPath string
	advisorId  string
)

const API = "http://localhost:8000/api"

//const API = "https://portal.amplifa.co.uk/api"

const IMPORT_SUPERUSER = "darren@amplifa.co.uk"

var DB *bun.DB

func Import(path string) {
	DB = Database.DB
	importPath = path
	log.Println("Importing from", importPath)

	export := &Export.Export{}
	fileBytes, _ := os.ReadFile(importPath)
	if err := json.Unmarshal(fileBytes, export); err != nil {
		panic(err)
	}

	//for _, user := range export.Users {
	//	createUser(user)
	//}
	for _, org := range export.Orgs {
		createOrg(org, export.Users)
	}
}

func createUser(user Entities.ReportUser) {
	if Helpers.IsSuperuser(user.Email) {
		return
	}
	var newUser = Entities.User{
		Uid:   user.Id,
		Email: user.Email,
	}
	if _, err := DB.NewInsert().
		Model(&newUser).
		Exec(context.TODO()); err != nil {
		panic(err)
	}
}

func createOrg(org Export.Org, allUsers []Entities.ReportUser) {
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

	importOrganisation(newOrg)

	importOrgResources(&org.Resources)

	importClients(&org.Clients)

}

func importOrganisation(mp Organisation.CreateOrganisationRequestBody) {
	jsonData, _ := json.Marshal(mp)
	request, err := http.NewRequest("POST", API+"/admin/organisations", bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", IMPORT_SUPERUSER)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create org:", mp.Name, resp.Status)
	}
}
