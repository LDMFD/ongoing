# Entrypoint
gcp-artifact-create-registry:
	gcloud artifacts repositories create ${REGISTRY_REPO} \
		--repository-format=docker \
		--location=${REGION}

gcp-artifact-create-sa: import-env
	gcloud iam service-accounts keys create ${HOME}/.ongoing/secrets/artifactory-key.json \
		--iam-account=${ARTIFACTORY_SA_ID_${ENV}}

# Allow Prod to read from Staging's Artifact Registry
gcp-artifact-grant-staging-access-to-prod:
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_staging} \
		--member=serviceAccount:service-474210866587@serverless-robot-prod.iam.gserviceaccount.com \
		--role=roles/artifactregistry.reader
