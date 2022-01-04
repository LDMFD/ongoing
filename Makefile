SHELL := /bin/bash
.ONESHELL:

include Makefiles/Environment.mak
include Makefiles/Firebase.mak
include Makefiles/Migrations.mak
include Makefiles/Node.mak
include Makefiles/Storage.mak

.DEFAULT_GOAL := all
all:
	@echo "No default target"
