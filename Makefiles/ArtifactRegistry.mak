# Entrypoint
gcp-artifact-create-registry:
	gcloud artifacts repositories create ${REGISTRY_REPO} \
		--repository-format=docker \
		--location=${REGION}

gcp-artifact-create-service-accounts: import-env
	gcloud iam service-accounts create ongoing-${ENV}-artifacts \
		--display-name="Ongoing (${ENV}) Artifact Registry reader"

gcp-artifact-create-sa-key: import-env
	gcloud iam service-accounts keys create ${HOME}/.ongoing/envs/${ENV}/secrets/image-registry/artifacts-key2.json \
		--iam-account=ongoing-${ENV}-artifacts@ongoing-${ENV}.iam.gserviceaccount.com

gcp-artifact-grant-sa-role:
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_staging} \
		--member=serviceAccount:ongoing-staging-artifacts@ongoing-staging.iam.gserviceaccount.com \
		--role=roles/artifactregistry.reader

# Allow Prod to read from Staging's Artifact Registry (CloudSQL - legacy)
gcp-artifact-grant-staging-access-to-prod:
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_staging} \
		--member=serviceAccount:service-474210866587@serverless-robot-prod.iam.gserviceaccount.com \
		--role=roles/artifactregistry.reader
