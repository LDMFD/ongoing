package Importer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"ongoing/Entities"
)

func importDocuments(clientId string, report Entities.ReportDetail, advisorId string) {
	importRiskAssessments(clientId, report, advisorId)
	importFactFinds(clientId, report, advisorId)
	importFeesReports(clientId, report, advisorId)
	importForecasts(clientId, report, advisorId)
}

func importRiskAssessments(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, ra := range report.RiskAssessments {
		requestJson, _ := json.Marshal(ra)
		url := fmt.Sprintf(API+"/advisor/clients/%v/risk-assessments", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", ra.Id)
		request.Header.Set("Authentication", advisorId)

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

func importFactFinds(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, ff := range report.FactFinds {
		requestJson, _ := json.Marshal(ff)
		url := fmt.Sprintf(API+"/advisor/clients/%v/fact-finds", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", ff.Id)
		request.Header.Set("Authentication", advisorId)

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

func importFeesReports(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, fr := range report.FeesReports {
		requestJson, _ := json.Marshal(fr)
		url := fmt.Sprintf(API+"/advisor/clients/%v/fees-reports", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", fr.Id)
		request.Header.Set("Authentication", advisorId)

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

func importForecasts(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, forecast := range report.Forecasts {
		requestJson, _ := json.Marshal(forecast)
		url := fmt.Sprintf(API+"/advisor/clients/%v/forecasts", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", forecast.Id)
		request.Header.Set("Authentication", advisorId)

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
