//+build wireinject

package main

import (
	"github.com/google/wire"
	"ongoing/ApiServer"
	"ongoing/Database"
)

func buildApp() (*App, error) {
	wire.Build(
		Database.New,
		ApiServer.New,

		newApp,
	)
	return nil, nil
}
