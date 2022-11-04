package Importer

import (
	"bytes"
	"encoding/json"
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/Entities"
)

type ClientEntitiesContainer struct {
	Metadata Entities.ClientReport
	Draft    Entities.ReportReviewMeta
	Report   Entities.ReportDetail
	Reviews  []Entities.ReportReview
}

//func importClient(filepath string) {
//	var cac ClientEntitiesContainer
//	//if err := json.Unmarshal(, &cac); err != nil {
//	//	panic(err)
//	//}
//
//	createClient(cac.Metadata)
//	createHoldings(cac.Metadata.Id, cac.Report)
//	createDocuments(cac.Metadata.Id, cac.Report)
//	createReviews(cac.Metadata.Id, cac.Reviews)
//}

func importClients(clients *[]ClientProfile.GetClientResponse, owner Entities.ReportUser, allUsers []Entities.ReportUser) error {
	for _, c := range *clients {
		var advisorEmail string
		for _, user := range allUsers {
			if user.Id == c.Metadata.AdvisorId {
				advisorEmail = user.Email
			}
		}
		if err := createClient(c.Metadata, c.Metadata.AdvisorId, advisorEmail); err != nil {
			return err
		}
		break
	}
	return nil
}

func createClient(clientRep Entities.ClientReport, advisorId string, advisorEmail string) error {
	requestBody := ClientProfile.CreateOrUpdateClientRequestBody{
		Identity: struct {
			Forenames string `binding:"required"`
			Surname   string `binding:"required"`
			Email     string `binding:"required"`
		}{
			Forenames: clientRep.Identity.Forenames,
			Surname:   clientRep.Identity.Surname,
			Email:     clientRep.Identity.Email,
		},
		Fee: clientRep.Fee,
	}
	log.Println(requestBody)

	requestJson, _ := json.Marshal(requestBody)
	request, err := http.NewRequest("POST", API+"/advisor/clients", bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("X-Ongoing-EntityId-user", clientRep.Id)
	//request.Header.Set("X-Ongoing-EntityId-client", clientRep.Id)
	request.Header.Set("Authentication", advisorEmail)
	//if clientRep.Id != advisorId {
	//request.Header.Set("X-ViewAs", advisorId)
	//}

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create client:", resp.Status, requestBody.Identity.Email, advisorId, clientRep.Id)
		return errors.New(resp.Status)
	}
	return nil
}
