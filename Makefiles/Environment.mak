# Environment management

gcp-login:
	gcloud auth login

# Configures `docker push` to use GCP Container Registry (for current GCP project)
gcp-configure-docker:
	gcloud auth configure-docker

# Depend on this target to set the Make variable ENV to the contents of ~/.ongoing-env (test/staging/prod)
# Exits with code 1 if the file is not found
import-env:
	$(eval ENV := $(shell cat ~/.ongoing/env.txt))
	@test -n "$(ENV)" || (echo "Error: Run 'make work-on-{staging|prod}' first" ; exit 1)

# Shows the current environment
show-env: import-env
	@echo "* ~/.ongoing env: ${ENV}"

# Creates ~/.ongoing/env with specified environment
_work-on:
	mkdir -p ~/.ongoing ~/.kube
	@echo "* Working on env: ${ENV}"
	@echo ${ENV} > ~/.ongoing/env.txt
	@gcloud config set project ${GCP_PROJECT_${ENV}}
	@gcloud auth configure-docker ${REGION}-docker.pkg.dev
	@gcloud config set run/region ${REGION}
	cd infra/Terraform && \
		terraform workspace select ${ENV}
	make write-local-secrets
	doctl kubernetes cluster kubeconfig save ongoing-cluster

write-local-secrets: import-env
	Makefiles/Helpers/write-local-secrets.sh

# Entrypoints
# Switch to respective GCP Project ("environments")
work-on-staging:
	@make _work-on ENV=staging  PROJECT=${GCP_PROJECT_staging}
work-on-prod:
	@make _work-on ENV=prod PROJECT=${GCP_PROJECT_prod}

docker-clean-hard:
	Makefiles/Helpers/docker-clean.sh

docker-clean:
	docker rmi -f europe-west2-docker.pkg.dev/ongoing-staging/ongoing/ongoing_dashboard-server
	docker rmi -f europe-west2-docker.pkg.dev/ongoing-staging/ongoing/ongoing-api
	docker rmi -f ongoing_dashboard
	docker rmi -f ongoing_dashboard-server
	docker rmi -f ongoing_react-dashboard-builder
	docker rmi -f ongoing-api
