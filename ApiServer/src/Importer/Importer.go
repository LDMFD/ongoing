package Importer

import (
	"encoding/json"
	"log"
	"os"
)

var (
	importPath   string
	advisorEmail string
)

const API = "http://localhost:8000/api"

//const API = "https://portal.amplifa.co.uk/api"

const IMPORT_SUPERUSER = "darren@amplifa.co.uk"

func Import(path string) {
	importPath = path
	globalEntities()
	importClients()
}

func globalEntities() {
	filepath := importPath + "/global-entities.json"
	log.Println("Importing from", filepath)

	ent := &GlobalEntitiesContainer{}
	fileBytes, _ := os.ReadFile(filepath)
	if err := json.Unmarshal(fileBytes, ent); err != nil {
		panic(err)
	}

	createOrg()

	importGlobalEntities(&ent.Entities)
}
