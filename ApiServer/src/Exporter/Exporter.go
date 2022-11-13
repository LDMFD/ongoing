package Exporter

import (
	"github.com/pkg/errors"
	"io"
	"log"
	"net/http"
	"ongoing/Importer"
	"os"
)

func Export(path string) {
	Importer.CheckReady()

	request, err := http.NewRequest("GET", "http://localhost:8000/api/admin/export", nil)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", Importer.IMPORT_SUPERUSER)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		panic(errors.New(resp.Status))
	}

	export, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	if err := os.WriteFile(path, export, 0644); err != nil {
		panic(errors.WithStack(err))
	}
}
