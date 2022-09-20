package Importer

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"ongoing/Entities"
)

func createFile(file *Entities.ReportFile) {
	jsonData, _ := json.Marshal(file)
	request, err := http.NewRequest("POST", API+"/storage/signal", bytes.NewBuffer(jsonData))
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
		log.Println("Create file:", resp.Status)
	}
}
