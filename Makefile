SHELL := /bin/bash
.ONESHELL:

include Makefiles/Constants.mak

include Makefiles/ArtifactRegistry.mak
include Makefiles/Building.mak
include Makefiles/Deploy.mak
include Makefiles/Environment.mak
include Makefiles/Firebase.mak
include Makefiles/Database.mak
include Makefiles/GCP.mak
include Makefiles/Node.mak
include Makefiles/Secrets.mak
include Makefiles/Storage.mak

.DEFAULT_GOAL := all
all:
	@echo "No default target"
