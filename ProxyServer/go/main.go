package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/pkg/errors"
)

func main() {
	var token *string
	var empty string
	token = &empty

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-Ongoing-Account, X-Ongoing-App, X-Ongoing-Secret")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method != "POST" {
			return
		}

		if r.Header.Get("X-Ongoing-Secret") != "" {
			http.NotFound(w, r)
			return
		}

		account := r.Header.Get("X-Ongoing-Account")
		app := r.Header.Get("X-Ongoing-App")

		if account == "" || app == "" {
			http.Error(w, "Bad request.", http.StatusBadRequest)
			return
		}

		if err := r.ParseMultipartForm(1024); err != nil {
			log.Println(err)
			http.Error(w, "Bad request.", http.StatusBadRequest)
			return
		}

		report := r.PostFormValue("report")

		resp, refresh := request(*token, account, app, report)

		if refresh {
			var err error
			if token, err = getToken(); err != nil {
				log.Fatal(err)
			}
			if resp, refresh = request(*token, account, app, report); refresh {
				log.Fatal("failed to refresh")
			}
		}
		w.Write(resp)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}

type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}

func getToken() (*string, error) {
	log.Println("refreshing token")

	var req *http.Request
	var resp *http.Response
	var err error

	baseUrl := "https://accounts.zoho.com/oauth/v2/token"
	grantType := "refresh_token"
	clientId := ""
	clientSecret := ""
	code := ""
	refreshToken := ""

	url := fmt.Sprintf("%s?grant_type=%s&client_id=%s&client_secret=%s&code=%s&refresh_token=%s",
		baseUrl, grantType, clientId, clientSecret, code, refreshToken)

	client := &http.Client{}

	if req, err = http.NewRequest("POST", url, nil); err != nil {
		log.Fatal(err)
	}

	if resp, err = client.Do(req); err != nil {
		log.Fatal(err)
	}

	if resp.StatusCode != 200 {
		log.Println("Status: " + resp.Status)
		log.Println(resp)
		return nil, errors.New(resp.Status)
	}

	raw_json, err := io.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		log.Fatal(err)
	}

	var response RefreshTokenResponse
	json.Unmarshal(raw_json, &response)

	return &response.AccessToken, nil
}

func request(token string, account string, app string, report string) ([]byte, bool) {
	if token == "" {
		return nil, true
	}

	var req *http.Request
	var resp *http.Response
	var err error

	url := fmt.Sprintf("https://creator.zoho.com/api/v2/%s/%s/report/%s", account, app, report)
	log.Println(url)

	client := &http.Client{}

	if req, err = http.NewRequest("GET", url, nil); err != nil {
		log.Fatal(err)
	}

	req.Header.Add("Authorization", "Bearer "+token)

	if resp, err = client.Do(req); err != nil {
		log.Fatal(err)
	}

	if resp.StatusCode == 401 {
		return nil, true
	}

	if resp.StatusCode != 200 {
		log.Println("Status: " + resp.Status)
		log.Println(resp)
		return nil, false
	}

	json, err := io.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		log.Fatal(err)
	}
	return json, false
}
