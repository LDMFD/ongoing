package main

import (
	"flag"
	"log"

	"github.com/pkg/errors"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Llongfile)
	log.Println("Amplifa API server: Starting...")

}

func main() {
	app, err := buildApp()
	if err != nil {
		log.Fatalf("%+v\n", errors.WithStack(err))
	}

	var importFlag = flag.String("import", "", "import path")
	var exportFlag = flag.String("export", "", "export path")
	flag.Parse()
	if *importFlag != "" {
		app.Import(*importFlag)
	} else if *exportFlag != "" {
		app.Export(*exportFlag)
	} else {
		app.Run()
	}
}
