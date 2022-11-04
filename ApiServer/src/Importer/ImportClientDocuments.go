package Importer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"ongoing/Entities"
)

func createDocuments(clientId string, report Entities.ReportDetail, advisorId string) {
	createRiskAssessments(clientId, report, advisorId)
	createFactFinds(clientId, report, advisorId)
	createFeesReports(clientId, report, advisorId)
	createForecasts(clientId, report, advisorId)
}

func createRiskAssessments(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, ra := range report.RiskAssessments {
		if ra.File != nil {
			createFile(ra.File, advisorId)
		}

		requestJson, _ := json.Marshal(ra)
		url := fmt.Sprintf(API+"/advisor/clients/%v/risk-assessments", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", ra.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

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

func createFactFinds(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, ff := range report.FactFinds {
		if ff.File != nil {
			createFile(ff.File, advisorId)
		}

		requestJson, _ := json.Marshal(ff)
		url := fmt.Sprintf(API+"/advisor/clients/%v/fact-finds", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", ff.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

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

func createFeesReports(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, fr := range report.FeesReports {
		if fr.File != nil {
			createFile(fr.File, advisorId)
		}

		requestJson, _ := json.Marshal(fr)
		url := fmt.Sprintf(API+"/advisor/clients/%v/fees-reports", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", fr.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

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

func createForecasts(clientId string, report Entities.ReportDetail, advisorId string) {
	for _, forecast := range report.Forecasts {
		if forecast.File != nil {
			createFile(forecast.File, advisorId)
		}

		requestJson, _ := json.Marshal(forecast)
		url := fmt.Sprintf(API+"/advisor/clients/%v/forecasts", clientId)
		request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
		if err != nil {
			panic(err)
		}
		request.Header.Set("X-Ongoing-EntityId", forecast.Id)
		request.Header.Set("Authentication", IMPORT_SUPERUSER)
		request.Header.Set("X-ViewAs", advisorId)

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

func createReviews(clientId string, reviews []Entities.ReportReview, advisorId string) {
	for _, review := range reviews {
		importReview(clientId, review, advisorId)
	}
}

func importReview(clientId string, review Entities.ReportReview, advisorId string) {
	requestJson, _ := json.Marshal(review)
	url := fmt.Sprintf(API+"/advisor/clients/%v/reviews/import", clientId)
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", IMPORT_SUPERUSER)
	request.Header.Set("X-ViewAs", advisorId)

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
