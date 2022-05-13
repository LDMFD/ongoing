_deploy-api: import-env
	gcloud run deploy ${SERVICE} \
		--project=ongoing-${ENV} \
		--service-account=ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${SERVICE}:latest \
		--region=${REGION} \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=${GCP_PROJECT_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}} \
		--port=8000 \
		--update-env-vars=ONGOING_API_HOST=${DOMAIN_${ENV}} \
		--update-env-vars=ONGOING_API_PORT=8000 \
		--update-env-vars=FIREBASE_CONFIG=/app/Config/Firebase/config.json \
		--update-env-vars=STORAGE_SA=storage@ongoing-${ENV}.iam.gserviceaccount.com \
		--update-env-vars=STORAGE_BUCKET=ongoing-${ENV}-docs \
		--update-env-vars=STORAGE_CREDENTIAL=/app/Config/Storage/Storage.pem \
		--update-secrets=POSTGRES_DSN=database-connection:${SECRET_DATABASE_CONNECTION_${ENV}} \
		--update-secrets=/app/Config/Storage/Storage.pem=storage-credential:${SECRET_STORAGE_CREDENTIAL_${ENV}} \
		--update-secrets=/app/Config/Firebase/config.json=firebase-sa-key:${SECRET_FIREBASE_SA_KEY_${ENV}}
	make gcp-update-traffic SERVICE=${SERVICE}

_deploy-dashboard: import-env
	gcloud run deploy ${SERVICE} \
		--project=ongoing-${ENV} \
		--service-account=ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/ongoing_dashboard-server:latest \
		--region=${REGION} \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=${DB_INSTANCE_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}} \
		--port=8080 \
		--update-env-vars=ONGOING_REACT_FIREBASE_CONFIG=/app/Config/Firebase/config.json \
		--update-env-vars=ONGOING_API_HOST=https://${DOMAIN_${ENV}}/api \
		--update-env-vars=ONGOING_DASHBOARD_HOST=https://${DOMAIN_${ENV}} \
		--update-secrets=ONGOING_REACT_FIREBASE_CLIENT_ID=firebase-client-id:${SECRET_FIREBASE_CLIENT_ID_${ENV}} \
		--update-secrets=/app/Config/Firebase/key.json=firebase-client-key:${SECRET_FIREBASE_CLIENT_KEY_${ENV}}
	make gcp-update-traffic SERVICE=${SERVICE}

gcp-update-traffic:
	gcloud run services update-traffic ${SERVICE} \
		--region=${REGION} \
		--to-latest

cloudrun-deploy-api:
	make _deploy-api SERVICE=ongoing-api

cloudrun-deploy-dashboard:
	make _deploy-dashboard SERVICE=ongoing-dashboard
