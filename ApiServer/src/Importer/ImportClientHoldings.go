package Importer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"ongoing/Config"
	"ongoing/Entities"
)

func importHoldings(clientId string, report Entities.ReportDetail, advisorId string) {
	importModules(clientId, report, advisorId)
	importPolicies(clientId, report, advisorId)
	importProviderDiscounts(clientId, report, advisorId)
	importPolicyFunds(clientId, report, advisorId)
	importPortfolios(clientId, report, advisorId)
}

func importModules(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, mod := range report.Modules {
		requestJson, _ := json.Marshal(mod)
		url := fmt.Sprintf(API+"/advisor/clients/%v/modules/%v", clientId, mod.Type)
		request, err := http.NewRequest("PUT", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("Authentication", advisorId)
		request.Header.Set(Config.ApiKeyHeaderName, Config.API_KEY)

		client := &http.Client{}
		resp, err := client.Do(request)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()

		if resp.StatusCode != 200 {
			log.Println("Create module:", resp.Status)
		}
	}
}

func importPolicies(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, pol := range report.Policies {
		requestJson, _ := json.Marshal(pol)
		url := fmt.Sprintf(API+"/advisor/clients/%v/policies", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pol.Id)
		request.Header.Set("Authentication", advisorId)
		request.Header.Set(Config.ApiKeyHeaderName, Config.API_KEY)

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

func importProviderDiscounts(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, pd := range report.ProviderDiscounts {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/platform-discounts", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorId)
		request.Header.Set(Config.ApiKeyHeaderName, Config.API_KEY)

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

func importPolicyFunds(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, pd := range report.PolicyFunds {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/policy-funds", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorId)
		request.Header.Set(Config.ApiKeyHeaderName, Config.API_KEY)

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

func importPortfolios(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, pd := range report.Portfolios {
		requestJson, _ := json.Marshal(pd)
		url := fmt.Sprintf(API+"/advisor/clients/%v/portfolios", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", pd.Id)
		request.Header.Set("Authentication", advisorId)
		request.Header.Set(Config.ApiKeyHeaderName, Config.API_KEY)

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
