package main

import (
	"ongoing/ApiServer"
	"log"
)

type App struct {
	apiServer *ApiServer.ApiServer
}

func newApp(apiServer *ApiServer.ApiServer) *App {
	return &App{
		apiServer: apiServer,
	}
}

func (app *App) Run() error {
	return app.runApiServer()
}

func (app *App) runApiServer() (err error) {
	if err = app.apiServer.ListenAndServe(); err != nil {
		log.Fatalf("%+v\n", err)
	}
	return err
}
