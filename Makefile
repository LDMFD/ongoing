SHELL := /bin/bash
.ONESHELL:

include Makefiles/Constants.mak

include Makefiles/Building.mak
include Makefiles/Environment.mak
include Makefiles/Firebase.mak
include Makefiles/Database.mak
include Makefiles/Node.mak
include Makefiles/Storage.mak

.DEFAULT_GOAL := all
all:
	@echo "No default target"
