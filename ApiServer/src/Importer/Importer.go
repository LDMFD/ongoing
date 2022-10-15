package Importer

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/uptrace/bun"
	"log"
	"net/http"
	"ongoing/ApiServer"
	"ongoing/ApiServer/Advisor/OrgAdmin/Commands"
	"ongoing/ApiServer/Superuser/Commands/Export"
	"ongoing/ApiServer/Superuser/Commands/Organisation"
	"ongoing/Database"
	"ongoing/Entities"
	"os"
)

var (
	importPath   string
	advisorEmail string
)

const API = "http://localhost:8000/api"

//const API = "https://portal.amplifa.co.uk/api"

const IMPORT_SUPERUSER = "darren@amplifa.co.uk"

var DB *bun.DB

func Import(path string) {
	DB = Database.DB
	importPath = path
	globalEntities()
	//importClients()
}

func globalEntities() {
	log.Println("Importing from", importPath)

	export := &Export.Export{}
	fileBytes, _ := os.ReadFile(importPath)
	if err := json.Unmarshal(fileBytes, export); err != nil {
		panic(err)
	}

	//for _, user := range export.AdminEntities.Users {
	//	createUser(user)
	//}
	for _, org := range export.AdminEntities.Organisations {
		createOrg(org, export.AdminEntities.Users)
	}
	//importGlobalEntities(&ent.Entities)
}

func createUser(user Entities.ReportUser) {
	if ApiServer.IsSuperuser(user.Email) {
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

func createOrg(org Entities.ReportOrganisation, allUsers []Entities.User) {
	var ownerId string
	for _, user := range org.Members {
		if user.Role == "owner" {
			ownerId = user.UserId
			break
		}
	}
	var owner Entities.User
	for _, user := range allUsers {
		if user.Uid == ownerId {
			owner = user
			break
		}
	}
	newOrg := Organisation.CreateOrganisationRequestBody{
		Email:     owner.Email,
		//Name:      owner.,
		Forenames: "",
		Surname:   "",
	}



	var advisor Commands.CreateAdvisorRequestBody
	if err := json.Unmarshal(advisorRequest, &advisor); err != nil {
		panic(err)
	}
	advisorEmail = advisor.Email

	request, err := http.NewRequest("POST", API+"/admin/organisations", bytes.NewBuffer(advisorRequest))
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
		log.Println("Create org:", resp.Status)
	"}
"}
