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

func importClients(clients *[]ClientProfile.GetClientResponse, owner Entities.ReportUser, allUsers []Entities.ReportUser) error {
	for _, c := range *clients {
		var userId string
		for _, user := range allUsers {
			if user.Id == c.Metadata.UserId {
				userId = user.Id
				break
			}
		}

		if err := importClient(c.Metadata, userId); err != nil {
			return err
		}

		importReviews(c.Metadata.Id, c.Reviews, c.Metadata.AdvisorId)
		importHoldings(c.Metadata.Id, c.Report, c.Metadata.AdvisorId)
		importDocuments(c.Metadata.Id, c.Report, c.Metadata.AdvisorId)
	}
	return nil
}

func importClient(clientRep Entities.ClientReport, userId string) error {
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

	requestJson, _ := json.Marshal(requestBody)
	request, err := http.NewRequest("POST", API+"/advisor/clients", bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("X-Ongoing-EntityId-user", userId)
	request.Header.Set("X-Ongoing-EntityId-client", clientRep.Id)
	request.Header.Set("Authentication", clientRep.AdvisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create client:", resp.Status, requestBody.Identity.Email, clientRep.AdvisorId, clientRep.Id)
		return errors.New(resp.Status)
	}
	return nil
}
