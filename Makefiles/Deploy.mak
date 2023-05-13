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
		--min-instances=1 \
		--max-instances=3 \
		--port=50051 \
		--use-http2 \
		--command=spicedb \
		--update-secrets=SPICEDB_GRPC_PRESHARED_KEY=spicedb-key:${SECRET_SPICEDB_PSK_${ENV}} \
		--update-env-vars=SPICEDB_DATASTORE_CONN_URI="${DB_CONNECTION}" \
		--update-env-vars=SPICEDB_DATASTORE_ENGINE=postgres \
		--update-env-vars=SPICEDB_GRPC_ADDR=0.0.0.0:50051 \
		--args=serve,--log-level=debug
	make cloudrun-update-traffic SERVICE=${SERVICE}

_deploy-api: import-env
	$(eval URI := $(shell gcloud run services describe ongoing-spice \
		--platform managed --region ${REGION} --format 'value(status.url)' | sed s/https:\\/\\/// ))

	gcloud run deploy ${SERVICE} \
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
		--min-instances=1 \
		--max-instances=3 \
		--port=8000 \
		--update-env-vars=FIREBASE_CONFIG=/app/Config/Firebase/config.json \
		--update-env-vars=ONGOING_API_HOST=${DOMAIN_${ENV}} \
		--update-env-vars=ONGOING_API_PORT=8000 \
		--update-env-vars=ONGOING_ENV=${ENV} \
		--update-env-vars=ONGOING_SPICEDB_HOST=${URI}:443 \
		--update-env-vars=ONGOING_SPICEDB_DB=spicedb-${ENV} \
		--update-env-vars=ONGOING_STORAGE_BUCKET=ongoing-${ENV}-docs \
		--update-env-vars=ONGOING_STORAGE_CREDENTIAL=/app/Config/Storage/Storage.pem \
		--update-env-vars=ONGOING_STORAGE_SA=storage@ongoing-${ENV}.iam.gserviceaccount.com \
		--update-env-vars=POSTGRES_DB=ongoing-${ENV} \
		--update-secrets=/app/Config/Firebase/config.json=firebase-sa-key:${SECRET_FIREBASE_SA_KEY_${ENV}} \
		--update-secrets=/app/Config/Storage/Storage.pem=storage-credential:${SECRET_STORAGE_CREDENTIAL_${ENV}} \
		--update-secrets=ONGOING_API_KEY=ongoing-api-key:${SECRET_API_KEY_${ENV}} \
		--update-secrets=ONGOING_SENTRY_DSN=sentry-dsn:${SECRET_SENTRY_DSN} \
		--update-secrets=ONGOING_SPICEDB_PSK=spicedb-key:${SECRET_SPICEDB_PSK_${ENV}} \
		--update-secrets=ONGOING_SUPERUSERS=superusers:${SECRET_SUPERUSERS_${ENV}} \
		--update-secrets=POSTGRES_DSN=database-connection:${SECRET_DATABASE_CONNECTION_${ENV}}
	make cloudrun-update-traffic SERVICE=${SERVICE}

_deploy-dashboard: import-env
	gcloud run deploy ${SERVICE} \
		--project=ongoing-${ENV} \
		--service-account=ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/ongoing-dashboard-server:${TAG} \
		--region=${REGION} \
		--platform=managed \
		--allow-unauthenticated \
		--add-cloudsql-instances=${DB_INSTANCE_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}} \
		--cpu=2 \
		--memory=4Gi \
		--min-instances=1 \
		--max-instances=3 \
		--port=8080 \
		--update-env-vars=ONGOING_API_HOST=https://${DOMAIN_${ENV}}/api \
		--update-env-vars=ONGOING_DASHBOARD_HOST=https://${DOMAIN_${ENV}} \
		--update-env-vars=ONGOING_ENV=${ENV} \
		--update-env-vars=ONGOING_REACT_FIREBASE_CONFIG=/app/Config/Firebase/config.json \
		--update-secrets=/app/Config/Firebase/key.json=firebase-client-key:${SECRET_FIREBASE_CLIENT_KEY_${ENV}} \
		--update-secrets=ONGOING_REACT_FIREBASE_CLIENT_ID=firebase-client-id:${SECRET_FIREBASE_CLIENT_ID_${ENV}} \
		--update-secrets=ONGOING_SENTRY_DSN=sentry-dsn:${SECRET_SENTRY_DSN}
	make cloudrun-update-traffic SERVICE=${SERVICE}

deploy-dashboard-static: import-env
	gcloud storage cp -Z -r DashboardServer/build/static gs://ongoing-${ENV}-static/${RELEASE}/static

cloudrun-update-traffic:
	gcloud run services update-traffic ${SERVICE} \
		--region=${REGION} \
		--to-latest

cloudrun-deploy-dashboard:
	make _deploy-dashboard SERVICE=ongoing-dashboard TAG=${TAG}
	make firebase-deploy

# For after SpiceDB is reset?
redeploy-api:
	make deploy-api RELEASE=latest
	make firebase-deploy

redeploy-all:
	make redeploy-api
	make firebase-deploy

up-spice:
	make _deploy-spice SERVICE=ongoing-spice TAG=${SPICEDB_VERSION}
	make firebase-deploy

up-api:
	$(eval UUID := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	@echo "*** DEPLOYING API SERVER ${UUID}"
	make build-image SERVICE=api RELEASE=${UUID}
	make docker-push-api RELEASE=${UUID}
	make deploy-api RELEASE=${UUID}
	@echo "*** DEPLOYED API SERVER ${UUID}"

up-dashboard:
	$(eval UUID := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	@echo "*** DEPLOYING DASHBOARD ${UUID}"
	make build-dashboard RELEASE=${UUID}
	make deploy-dashboard-static RELEASE=${UUID}
	make docker-push-dashboard RELEASE=${UUID}
	make deploy-dashboard RELEASE=${UUID}
	@echo "*** DEPLOYED DASHBOARD ${UUID}"

up-all:
	make up-api
	make up-dashboard
