package main

import (
	"flag"
	"github.com/getsentry/sentry-go"
	"github.com/pkg/errors"
	"log"
	"os"
	"strings"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Llongfile)
	log.Println("Amplifa API server: Starting...")

}

func main() {
	initSentry()

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

var release string

func initSentry() {
	err := sentry.Init(sentry.ClientOptions{
		Dsn:              strings.Trim(os.Getenv("ONGOING_SENTRY_DSN"), "\n\t "),
		TracesSampleRate: 1.0,
		Debug:            true,
		AttachStacktrace: true,
		Release:          release, // from build flags
	})
	if err != nil {
		log.Fatalf("sentry.Init: %s", err)
	}
}
