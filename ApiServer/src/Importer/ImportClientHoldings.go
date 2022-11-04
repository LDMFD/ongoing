package Importer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"ongoing/Entities"
)

func createHoldings(clientId string, clientRep Entities.ReportDetail, advisorId string) {
	createPolicies(clientId, clientRep, advisorId)
	createProviderDiscounts(clientId, clientRep, advisorId)
	createPolicyFunds(clientId, clientRep, advisorId)
	createPortfolios(clientId, clientRep, advisorId)
}

func createPolicies(clientId string, clientRep Entities.ReportDetail, advisorId string) {
	for _, pd := range clientRep.Policies {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/policies", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create policy:", resp.Status)
		}
	}
}

func createProviderDiscounts(clientId string, clientRep Entities.ReportDetail, advisorId string) {
	for _, pd := range clientRep.ProviderDiscounts {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/provider-discounts", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create provider discount:", resp.Status)
		}
	}
}

func createPolicyFunds(clientId string, clientRep Entities.ReportDetail, advisorId string) {
	for _, pd := range clientRep.PolicyFunds {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/policy-funds", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create policy fund:", resp.Status)
		}
	}
}

func createPortfolios(clientId string, clientRep Entities.ReportDetail, advisorId string) {
	for _, pd := range clientRep.Portfolios {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/portfolios", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create portfolio:", resp.Status)
		}
	}
}
