# Caller: gcp-init (GCP.mak)
_gcp-sql-setup:
	make _gcp-sql-create
	make _gcp-sql-create-secrets
	make gcp-sql-cycle-password
	make _gcp-allow-cloud-run-to-access-database
	make _gcp-create-db-proxy-service-account
	make _db-create-remote-spicedb

# Creates CloudSQL DB
_gcp-sql-create: import-env
	gcloud sql instances create ${DB_INSTANCE_${ENV}} \
		--cpu=1 \
		--memory=3840MiB  \
		--database-version=${POSTGRES_VERSION} \
		--zone ${ZONE} \
		--availability-type=ZONAL  \
		--backup-start-time="01:00" \
		--backup-location=${REGION} \
		--insights-config-query-insights-enabled \
		--storage-auto-increase

	gcloud sql instances patch ${DB_INSTANCE_${ENV}} \
		--enable-point-in-time-recovery

	gcloud sql databases create \
		--instance=${DB_INSTANCE_${ENV}} \
		--project=ongoing-${ENV} \
		ongoing-${ENV}

_gcp-sql-create-secrets:
	gcloud secrets create database-connection \
	    --replication-policy="automatic"

	gcloud secrets create database-password \
	    --replication-policy="automatic"

gcp-sql-cycle-password: import-env
	mkdir -p ~/.ongoing/envs/${ENV}/secrets/cloud-sql
	$(eval PASSWORD := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))

	echo -n ${PASSWORD} > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password

	echo -n unix://postgres:${PASSWORD}@/cloudsql/${GCP_PROJECT_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}}/.s.PGSQL.5432?sslmode=disable \
		> ~/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-unix

	echo -n Host=localhost\;Port=5432\;Database=ongoing-${ENV}\;Username=postgres\;Password=${PASSWORD} \
		> ~/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-dotnet

	gcloud secrets versions add database-connection --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-unix

	gcloud secrets versions add database-password --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/cloud-sql/password
	
	gcloud sql users set-password postgres \
		--instance=${DB_INSTANCE_${ENV}} \
		--password=${PASSWORD}

	#gcloud secrets versions add spicedb-connection --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/spicedb/connection

# Allow Cloud Run to read secrets and connect to DB
_gcp-allow-cloud-run-to-access-database: import-env
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_${ENV}} \
		--member=serviceAccount:ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--role=roles/secretmanager.secretAccessor

	gcloud projects add-iam-policy-binding ${GCP_PROJECT_${ENV}} \
		--member=serviceAccount:ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--role=roles/cloudsql.client

_gcp-create-db-proxy-service-account: import-env
	mkdir -p ~/.ongoing/envs/${ENV}/secrets/cloud-sql
	gcloud iam service-accounts create cloudsql-proxy --display-name "cloudsql-proxy"
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_${ENV}} --member serviceAccount:cloudsql-proxy@${GCP_PROJECT_${ENV}}.iam.gserviceaccount.com --role roles/cloudsql.client
	gcloud iam service-accounts keys create ${HOME}/.ongoing/secrets/cloud-sql/dbproxy-credentials.json --iam-account cloudsql-proxy@${GCP_PROJECT_${ENV}}.iam.gserviceaccount.com
	gcloud secrets create db-proxy --replication-policy=automatic --data-file=${HOME}/.ongoing/secrets/cloud-sql/dbproxy-credentials.json

# ---

_gcp-sql-teardown: import-env
	gcloud sql instances delete ${DB_INSTANCE_${ENV}}
	gcloud secrets delete database-connection
	gcloud iam service-accounts delete cloudsql-proxy@${GCP_PROJECT_${ENV}}.iam.gserviceaccount.com
	gcloud secrets delete db-proxy

# ---

db-proxy: import-env
	mkdir -p ~/.ongoing/envs/${ENV}/secrets/cloud-sql
	gcloud secrets versions access ${SECRET_DB_PROXY_VERSION_${ENV}} --secret="db-proxy" > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/credential.json
	docker run -it --rm \
		--name db-proxy \
		--platform linux/amd64 \
		--network ongoing_default \
		-p "5432:5432" \
		-v ~/.ongoing/envs/${ENV}/secrets/cloud-sql/credential.json:/credential.json \
		gcr.io/cloudsql-docker/gce-proxy:${SQL_PROXY_VERSION} /cloud_sql_proxy \
		-instances=ongoing-${ENV}:${REGION}:${DB_INSTANCE_${ENV}}=tcp:0.0.0.0:5432 \
		-credential_file=/credential.json
