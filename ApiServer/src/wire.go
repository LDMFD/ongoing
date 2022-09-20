//go:build wireinject
// +build wireinject

package main

import (
	"github.com/google/wire"
	"ongoing/ApiServer"
	"ongoing/AuthService"
	"ongoing/Database"
)

func buildApp() (*App, error) {
	wire.Build(
		Database.New,
		AuthService.New,
		ApiServer.New,

		newApp,
	)
	return nil, nil
}
