package Importer

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"strings"
	"testing"
	"time"
)

func checkReady() {
	for {
		if healthcheck() {
			log.Println("Healthcheck passed")
			break
		} else {
			time.Sleep(time.Second)
			log.Println("Healthcheck failed")
		}
	}
}

func healthcheck() bool {
	request, err := http.NewRequest("GET", API+"/healthcheck", bytes.NewBufferString(""))
	if err != nil {
		log.Println(err)
		return false
	}

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		log.Println(err)
		return false
	}
	defer resp.Body.Close()

	buf := new(strings.Builder)
	if _, err := io.Copy(buf, resp.Body); err != nil {
		panic(err)
	}

	log.Println(resp.Status, buf)

	if resp.StatusCode != 200 {
		return false
	}
	return true
}

func TestHealthcheck2(t *testing.T) {
	request, err := http.NewRequest("GET", API+"/healthcheck", bytes.NewBufferString(""))
	if err != nil {
		panic(err)
	}

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		t.Error(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Error("expected 200")
	}

}
