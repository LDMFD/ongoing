package Importer

import (
	"encoding/json"
	"log"
	"ongoing/ApiServer/Superuser/Commands/Export"
	"os"
)

var (
	importPath string
)

const API = "http://localhost:8000/api"

const IMPORT_SUPERUSER = "darren@amplifa.co.uk"

func Import(path string) {
	importPath = path
	log.Println("Importing from", importPath)

	CheckReady()

	export := &Export.Export{}
	fileBytes, _ := os.ReadFile(importPath)
	if err := json.Unmarshal(fileBytes, export); err != nil {
		panic(err)
	}

	if err := runImport(export); err != nil {
		log.Fatal(err)
	}

	os.Exit(0)
}

func runImport(export *Export.Export) error {
	for _, org := range export.Orgs {
		if err := createOrg(org, export.Users); err != nil {
			return err
		}
	}
	return nil
}
