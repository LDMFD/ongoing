gcp-setup:
	make _gcp-enable-services
	make _gcp-create-service-accounts
	make _gcp-sql-setup
	make _gcp-storage-setup
	make _gcp-firebase-setup
	make _api-setup
	make _integration-plannr-setup

_gcp-enable-services:
	gcloud services enable compute.googleapis.com
	gcloud services enable artifactregistry.googleapis.com
	gcloud services enable sqladmin.googleapis.com
	gcloud services enable secretmanager.googleapis.com
	gcloud services enable run.googleapis.com

# Create service account for Cloud Run
_gcp-create-service-accounts: import-env
	gcloud iam service-accounts create ongoing-${ENV}-cloud-run \
		--display-name="Ongoing (${ENV}) Cloud Run"

# Delete service account for Cloud Run
_gcp-delete-service-accounts: import-env
	gcloud iam service-accounts delete ongoing-${ENV}-cloud-run@${GCP_PROJECT_${ENV}}.iam.gserviceaccount.com

# ---

_gcp-cloudrun-teardown:
	gcloud run services delete ongoing-api
	gcloud run services delete ongoing-dashboard

gcp-teardown:
	make _gcp-cloudrun-teardown
	make _gcp-firebase-teardown
	make _gcp-storage-teardown
	make _gcp-sql-teardown
	make _gcp-delete-service-accounts
