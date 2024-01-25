# Setup - use this to store a Digital Ocean PAT in GCP Secret Manager
do-create-pat-secret: import-env
	gcloud secrets create do-pat \
	    --replication-policy="automatic"

	SECRET=do-pat \
		Makefiles/Helpers/input-secret.sh

# Setup - create initial workspaces
tf-init: import-env
	cd infra/Terraform && \
		terraform init && \
		terraform workspace new staging && \
		terraform workspace new prod

# Upgrade Terraform version
tf-upgrade: import-env
	cd infra/Terraform && \
		terraform init -upgrade && \
		terraform workspace new staging && \
		terraform workspace new prod

# Run a Terraform command with the correct environment and Digital Ocean PAT
tf-command: import-env
	cd infra/Terraform && \
	terraform ${COMMAND} \
		-var-file="${HOME}/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars" \
		-var="environment=${ENV}"

# Show what apply will do
tf-plan:
	make tf-command COMMAND=plan

# Apply local changes
tf-apply:
	make tf-command COMMAND=apply

# Syncs local state with remote
tf-refresh:
	make tf-command COMMAND=refresh

# Create local state from remote
tf-import: import-env
	cd infra/Terraform && \
		terraform import ${OBJECT} ${ID} \
			-var-file="${HOME}/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars" \
			-var="container_registry=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}" \
			-var="environment=${ENV}"

# Destroys all
tf-destroy:
	make tf-command COMMAND=destroy

# Remove a specific resource from state
# Example usage:
# make tf-rm helm_release.ongoing_api
tf-rm:
	cd infra/Terraform && \
		terraform state rm ${OBJECT}

# Invoke the Terraform console
tf-console:
	make tf-command COMMAND=console
