package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"ongoing/ApiServer"
	"ongoing/Importer"
	"os"
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
