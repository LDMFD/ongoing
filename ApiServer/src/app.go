package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"ongoing/ApiServer"
	"ongoing/Exporter"
	"ongoing/Importer"
	"ongoing/Outbox"
	"os"
)

type App struct {
	apiServer *ApiServer.ApiServer
	Outbox    *Outbox.Outbox
}

func newApp(apiServer *ApiServer.ApiServer, outbox *Outbox.Outbox) *App {
	return &App{
		apiServer: apiServer,
		Outbox:    outbox,
	}
}

func (app *App) Run() error {
	go app.Outbox.RunOutbox()
	return app.runApiServer()
}

func (app *App) runApiServer() (err error) {
	if router, err := app.apiServer.BuildRouter(); err != nil {
		log.Fatalf("%+v\n", err)
	} else {
		router.Run(":" + os.Getenv("ONGOING_API_PORT"))
	}
	return err
}

func (app *App) GetRouter() (*gin.Engine, error) {
	if router, err := app.apiServer.BuildRouter(); err != nil {
		log.Fatalf("%+v\n", err)
		return nil, err
	} else {
		return router, nil
	}
}

func (app *App) Import(path string) {
	go Importer.Import(path)
	app.Run()
}

func (app *App) Export(path string) {
	go app.Run()
	Exporter.Export(path)
}
