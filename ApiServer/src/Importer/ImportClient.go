package Importer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/ClientProfile"
	"ongoing/Entities"
	"os"
)

type ClientEntitiesContainer struct {
	ClientContext Entities.ClientReport
	Draft         Entities.ReportReviewMeta
	Report        Entities.ReportDetail
	Reviews       []Entities.ReportReview
}

func importClients() {
	for i := 1; i <= 5; i++ {
		filepath := importPath + fmt.Sprintf("/clients/client-%d.json", i)
		//log.Println("Importing from", filepath)

		importClient(filepath)
	}
}

func importClient(filepath string) {
	clientJson, _ := os.ReadFile(filepath)
	var cac ClientEntitiesContainer
	if err := json.Unmarshal(clientJson, &cac); err != nil {
		panic(err)
	}

	createClient(cac.ClientContext)
	createHoldings(cac.ClientContext.Id, cac.Report)
	createDocuments(cac.ClientContext.Id, cac.Report)
	createReviews(cac.ClientContext.Id, cac.Reviews)
}

func createClient(clientRep Entities.ClientReport) {
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
	request.Header.Set("X-Amplifa-EntityId", clientRep.Id)
	request.Header.Set("Authentication", advisorEmail)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create client:", resp.Status)
	}
}

func createHoldings(clientId string, clientRep Entities.ReportDetail) {
	createPolicies(clientId, clientRep)
	createProviderDiscounts(clientId, clientRep)
	createPolicyFunds(clientId, clientRep)
	createPortfolios(clientId, clientRep)
}

func createPolicies(clientId string, clientRep Entities.ReportDetail) {
	for _, pd := range clientRep.Policies {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/policies", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorEmail)

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

func createProviderDiscounts(clientId string, clientRep Entities.ReportDetail) {
	for _, pd := range clientRep.ProviderDiscounts {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/provider-discounts", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorEmail)

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

func createPolicyFunds(clientId string, clientRep Entities.ReportDetail) {
	for _, pd := range clientRep.PolicyFunds {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/policy-funds", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorEmail)

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

func createPortfolios(clientId string, clientRep Entities.ReportDetail) {
	for _, pd := range clientRep.Portfolios {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/portfolios", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorEmail)

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

func createDocuments(clientId string, report Entities.ReportDetail) {
	createRiskAssessments(clientId, report)
	createFactFinds(clientId, report)
	createFeesReports(clientId, report)
	createForecasts(clientId, report)
}

func createRiskAssessments(clientId string, report Entities.ReportDetail) {
	for _, ra := range report.RiskAssessments {
		if ra.Questionnaire != nil {
			createFile(ra.Questionnaire)
		}

		requestJson, _ := json.Marshal(ra)
		url := fmt.Sprintf(API+"/advisor/clients/%v/risk-assessments", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", ra.Id)
		request.Header.Set("Authentication", advisorEmail)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create risk assessment:", resp.Status)
		}
	}
}

func createFactFinds(clientId string, report Entities.ReportDetail) {
	for _, ff := range report.FactFinds {
		if ff.File != nil {
			createFile(ff.File)
		}

		requestJson, _ := json.Marshal(ff)
		url := fmt.Sprintf(API+"/advisor/clients/%v/fact-finds", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", ff.Id)
		request.Header.Set("Authentication", advisorEmail)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create fact find:", resp.Status)
		}
	}
}

func createFeesReports(clientId string, report Entities.ReportDetail) {
	for _, fr := range report.FeesReports {
		if fr.File != nil {
			createFile(fr.File)
		}

		requestJson, _ := json.Marshal(fr)
		url := fmt.Sprintf(API+"/advisor/clients/%v/fees-reports", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", fr.Id)
		request.Header.Set("Authentication", advisorEmail)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create fees report:", resp.Status)
		}
	}
}

func createForecasts(clientId string, report Entities.ReportDetail) {
	for _, forecast := range report.Forecasts {
		if forecast.File != nil {
			createFile(forecast.File)
		}

		requestJson, _ := json.Marshal(forecast)
		url := fmt.Sprintf(API+"/advisor/clients/%v/forecasts", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Amplifa-EntityId", forecast.Id)
		request.Header.Set("Authentication", advisorEmail)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create forecast:", resp.Status)
		}
	}
}

func createReviews(clientId string, reviews []Entities.ReportReview) {
	for _, review := range reviews {
		importReview(clientId, review)
	}
}

func importReview(clientId string, review Entities.ReportReview) {
	requestJson, _ := json.Marshal(review)
	url := fmt.Sprintf(API+"/advisor/clients/%v/reviews/import", clientId)
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create review:", resp.Status)
	}
}
