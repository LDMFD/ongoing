SHELL := /bin/bash
.ONESHELL:

include Makefiles/Constants.mak

include Makefiles/ApiKeys.mak
include Makefiles/ArtifactRegistry.mak
include Makefiles/Building.mak
include Makefiles/Deploy.mak
include Makefiles/Database/_include.mak
include Makefiles/Environment.mak
include Makefiles/Firebase.mak
include Makefiles/GCP.mak
include Makefiles/Healthchecks.mak
include Makefiles/Helm.mak
include Makefiles/Integrations.mak
include Makefiles/Node.mak
include Makefiles/Releasing.mak
include Makefiles/Secrets.mak
include Makefiles/Sentry.mak
include Makefiles/SpiceDB.mak
include Makefiles/Storage.mak
include Makefiles/Terraform.mak

.DEFAULT_GOAL := all
all:
	@echo "No default target"
