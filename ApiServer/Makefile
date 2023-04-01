SHELL := /bin/bash

import:
	@./env-import.sh

tidy: import
	cd src && \
	go get github.com/google/wire/cmd/wire && \
	go mod tidy

wire: import
	cd src && wire

install:
	cd src && go install .

get:
	cd src && go get ${PACKAGE}
