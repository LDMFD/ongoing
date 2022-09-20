_deploy-spice: import-env
	$(eval DB_CONNECTION := $(shell cat ~/.ongoing/envs/${ENV}/secrets/spicedb/connection))

	gcloud beta run deploy ${SERVICE} \
		--execution-environment=gen2 \
		--project=ongoing-${ENV} \
		--service-account=ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/spicedb:${TAG} \
		--region=${REGION} \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=${DB_INSTANCE_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}} \
		--cpu=2 \
		--memory=4Gi \
		--max-instances=8 \
		--port=50051 \
		--use-http2 \
		--command=spicedb \
		--update-secrets=SPICEDB_GRPC_PRESHARED_KEY=spicedb-key:${SECRET_SPICEDB_PSK_${ENV}} \
		--update-env-vars=SPICEDB_GRPC_ADDR=0.0.0.0:50051 \
		--update-env-vars=SPICEDB_DATASTORE_ENGINE=postgres \
		--update-env-vars=SPICEDB_DATASTORE_CONN_URI="${DB_CONNECTION}" \
		--args=serve,--log-level=debug
	make cloudrun-update-traffic SERVICE=${SERVICE}

_deploy-api: import-env
	$(eval URI := $(shell gcloud run services describe ongoing-spice \
		--platform managed --region ${REGION} --format 'value(status.url)' | sed s/https:\\/\\/// ))

	gcloud beta run deploy ${SERVICE} \
		--execution-environment=gen2 \
		--project=ongoing-${ENV} \
		--service-account=ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${SERVICE}:${TAG} \
		--region=${REGION} \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=${GCP_PROJECT_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}} \
		--cpu=2 \
		--memory=4Gi \
		--max-instances=8 \
		--port=8000 \
		--update-env-vars=ONGOING_API_HOST=${DOMAIN_${ENV}} \
		--update-env-vars=ONGOING_API_PORT=8000 \
		--update-env-vars=FIREBASE_CONFIG=/app/Config/Firebase/config.json \
		--update-env-vars=STORAGE_SA=storage@ongoing-${ENV}.iam.gserviceaccount.com \
		--update-env-vars=STORAGE_BUCKET=ongoing-${ENV}-docs \
		--update-env-vars=STORAGE_CREDENTIAL=/app/Config/Storage/Storage.pem \
		--update-env-vars=POSTGRES_DB=ongoing-${ENV} \
		--update-env-vars=ONGOING_SPICEDB_HOST=${URI}:443 \
		--update-secrets=ONGOING_SPICEDB_PSK=spicedb-key:${SECRET_SPICEDB_PSK_${ENV}} \
		--update-secrets=POSTGRES_DSN=database-connection:${SECRET_DATABASE_CONNECTION_${ENV}} \
		--update-secrets=/app/Config/Storage/Storage.pem=storage-credential:${SECRET_STORAGE_CREDENTIAL_${ENV}} \
		--update-secrets=/app/Config/Firebase/config.json=firebase-sa-key:${SECRET_FIREBASE_SA_KEY_${ENV}} \
		--update-secrets=ONGOING_SUPERUSERS=superusers:${SECRET_SUPERUSERS_${ENV}}
	make cloudrun-update-traffic SERVICE=${SERVICE}

_deploy-dashboard: import-env
	gcloud run deploy ${SERVICE} \
		--project=ongoing-${ENV} \
		--service-account=ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/ongoing_dashboard-server:${TAG} \
		--region=${REGION} \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=${DB_INSTANCE_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}} \
		--cpu=2 \
		--memory=4Gi \
		--max-instances=8 \
		--port=8080 \
		--update-env-vars=ONGOING_REACT_FIREBASE_CONFIG=/app/Config/Firebase/config.json \
		--update-env-vars=ONGOING_API_HOST=https://${DOMAIN_${ENV}}/api \
		--update-env-vars=ONGOING_DASHBOARD_HOST=https://${DOMAIN_${ENV}} \
		--update-secrets=ONGOING_REACT_FIREBASE_CLIENT_ID=firebase-client-id:${SECRET_FIREBASE_CLIENT_ID_${ENV}} \
		--update-secrets=/app/Config/Firebase/key.json=firebase-client-key:${SECRET_FIREBASE_CLIENT_KEY_${ENV}}
	make cloudrun-update-traffic SERVICE=${SERVICE}

cloudrun-update-traffic:
	gcloud run services update-traffic ${SERVICE} \
		--region=${REGION} \
		--to-latest

cloudrun-deploy-api:
	make _deploy-api SERVICE=ongoing-api TAG=latest

cloudrun-deploy-dashboard:
	make _deploy-dashboard SERVICE=ongoing-dashboard TAG=latest

up-spice:
	make _deploy-spice SERVICE=ongoing-spice TAG=${SPICEDB_VERSION}
	make firebase-deploy

up-api:
	make build-image SERVICE=api
	make push-image IMAGE=ongoing-api
	make cloudrun-deploy-api
	make firebase-deploy

up-dashboard:
	make build-dashboard
	make push-image IMAGE=ongoing_dashboard-server
	make cloudrun-deploy-dashboard
	make firebase-deploy

up-all:
	make up-api
	make up-dashboard
