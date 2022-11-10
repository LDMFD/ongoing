package Importer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"ongoing/Entities"
)

func importReviews(clientId string, reviews []Entities.ReportReview, advisorId string) {
	for _, review := range reviews {
		importReview(clientId, review, advisorId)
	}
}

func importReview(clientId string, review Entities.ReportReview, advisorId string) {
	url := fmt.Sprintf(API+"/advisor/clients/%v/reviews/import", clientId)
	requestJson, _ := json.Marshal(review)
	request, err := http.NewRequest("POST", url, bytes.NewBuffer(requestJson))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

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
