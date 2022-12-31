package Importer

import (
	"encoding/json"
	"log"
	"ongoing/Entities"
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

	export := &Entities.Export{}
	if fileBytes, err := os.ReadFile(importPath); err != nil {
		panic(err)
	} else if err := json.Unmarshal(fileBytes, export); err != nil {
		panic(err)
	}

	if err := RunImport(export); err != nil {
		log.Fatal(err)
	}

	os.Exit(0)
}

func RunImport(export *Entities.Export) error {
	for _, org := range export.Orgs {
		if err := createOrg(org, export.Users); err != nil {
			return err
		}
	}
	return nil
}
