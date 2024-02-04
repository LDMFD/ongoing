# GCP bucket creation for TF state

gcp-tf-state-setup:
	make work-on-staging

	gcloud iam service-accounts create ongoing-tf-state \
		--display-name="Ongoing bucket admin for Terraform state"

	gcloud iam service-accounts keys create ${HOME}/.ongoing/envs/staging/secrets/tf-state/tf-state-key.json \
		--iam-account=ongoing-tf-state@ongoing-staging.iam.gserviceaccount.com

	gcloud projects add-iam-policy-binding ${GCP_PROJECT_staging} \
		--member=serviceAccount:ongoing-tf-state@ongoing-staging.iam.gserviceaccount.com \
		--role=roles/storage.admin

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
		terraform import \
			-var-file="${HOME}/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars" \
			-var="environment=${ENV}" \
			 ${ADDR} ${ID}

# Destroys all
tf-destroy:
	make tf-command COMMAND=destroy

# Remove a specific resource from state
# Example usage:
# make tf-rm helm_release.ongoing_api
tf-rm:
	cd infra/Terraform && \
		terraform state rm ${OBJECT}


tf-create-targetted: import-env
	cd infra/Terraform && \
		terraform apply -target=${OBJECT} \
			-var-file="${HOME}/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars" \
			-var="environment=${ENV}"

tf-destroy-targetted: import-env
	cd infra/Terraform && \
		terraform destroy -target=${OBJECT} \
			-var-file="${HOME}/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars" \
			-var="environment=${ENV}"


# Invoke the Terraform console
tf-console:
	make tf-command COMMAND=console

tf-tmp: import-env
	cd infra/Terraform && \
		terraform import \
			-var-file="${HOME}/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars" \
			-var="environment=${ENV}" \
			helm_release.nginx_ingress default/nginx-ingress \
