SHELL := /bin/bash
.ONESHELL:

include Makefiles/GCP.mak
include Makefiles/Environment.mak
include Makefiles/Migrations.mak

.DEFAULT_GOAL := all
all:
	@echo "No default target"
