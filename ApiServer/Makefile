SHELL := /bin/bash

import:
	@./env-import.sh

tidy: import
	go get github.com/google/wire/cmd/wire
	cd src && \
	go mod tidy

wire: import
	cd src && ../bin/wire

install:
	cd src && go install .
