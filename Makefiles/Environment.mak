# Environment management

gcp-login:
	gcloud auth login

# Configures `docker push` to use GCP Container Registry (for current GCP project)
gcp-configure-docker:
	gcloud auth configure-docker

# Depend on this target to set the Make variable ENV to the contents of ~/.ongoing-env (test/staging/prd)
# Exits with code 1 if the file is not found
import-env:
	$(eval ENV := $(shell cat ~/.ongoing/env.txt))
	@test -n "$(ENV)" || (echo "Error: Run 'make work-on-{test|staging}' first" ; exit 1)

# Shows the current environment
show-env: import-env
	@echo "* ~/.ongoing env: ${ENV}"

# Creates ~/.ongoing/env with specified environment
_work-on:
	mkdir -p ~/.ongoing
	@echo "* Working on env: ${ENV}"
	@echo ${ENV} > ~/.ongoing/env.txt
	@gcloud config set project ${GCP_PROJECT_${ENV}}
	@gcloud auth configure-docker ${REGION}-docker.pkg.dev
	@gcloud config set run/region ${REGION}

# Entrypoints
# Switch to respective GCP Project ("environments")
work-on-test:
	@make _work-on ENV=test PROJECT=${GCP_PROJECT_test}
work-on-staging:
	@make _work-on ENV=staging  PROJECT=${GCP_PROJECT_staging}
