# Caller: gcp-init (GCP.mak)
_gcp-sql-setup:
	make _gcp-sql-create
	make _gcp-sql-create-secrets
	make gcp-sql-cycle-password
	make _gcp-allow-cloud-run-to-access-database
	make _gcp-create-db-proxy-service-account

# Creates CloudSQL DB
_gcp-sql-create: import-env
	gcloud sql instances create ${DB_INSTANCE_${ENV}} \
		--cpu=1 \
		--memory=3840MiB  \
		--database-version=${POSTGRES_VERSION} \
		--zone ${ZONE} \
		--availability-type=ZONAL  \
		--backup-start-time="01:00" \
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

	echo -n Host=localhost\;Port=5432\;Database=postgres\;Username=postgres\;Password=${PASSWORD} \
		> ~/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-dotnet

	gcloud secrets versions add database-connection --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-unix

	gcloud secrets versions add database-password --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/cloud-sql/password
	
	gcloud sql users set-password postgres \
		--instance=${DB_INSTANCE_${ENV}} \
		--password=${PASSWORD}

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

# Local:
db-migrate-local: import-env
	docker run \
		-it \
		--rm \
		--network ongoing_default \
		-v `pwd`/Migrations:/app/migrations \
		-v `pwd`/pgpass:/root/.pgpass \
		-e PGPASSFILE=/root/.pgpass \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			psql --host=ongoing-db \
				 --dbname=postgres \
				 --username=postgres \
				 --file=/app/migrations/${MIGRATION}.sql

db-migrate-remote:
	docker run -it --rm \
		--name db-migration \
		--network ongoing_default \
		-v `pwd`/Migrations:/app/migrations \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			psql --host=db-proxy \
				 --dbname=postgres \
				 --username=postgres \
				 --password \
				 --file=/app/migrations/${MIGRATION}.sql

# Param FROM: the .sql file to import from
db-restore-local:
	docker run -it --rm \
		--name db-restorer \
		--platform linux/amd64 \
		--network ongoing_default \
		-v ${HOME}/.ongoing/dumps/dump.sql:/app/dump.sql \
        ${LOCAL_POSTGRES_IMAGE} \
            /bin/bash \
            -c "PGPASSWORD=p psql -U postgres -h ongoing-db < /app/dump.sql"

db-restore-remote: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	docker run -i \
	    --network ongoing_default \
        -v ~/.ongoing/envs/${ENV}/dumps/dump.sql:/dump.sql \
		--platform linux/amd64 \
        ${LOCAL_POSTGRES_IMAGE} \
            /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy < /dump.sql"

# In these, change --data-only to --schema-only to control output.
db-dump-local:
	docker run -it --rm \
		--name db-dump \
		--network ongoing_default \
		-v ${HOME}/.ongoing/dumps/dump.sql:/app/dump.sql \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			pg_dump --host=ongoing-db \
					--dbname=postgres \
					--username=postgres \
					--password \
					--no-comments \
					--schema-only --no-acl --column-inserts --no-comments

db-dump-remote: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	mkdir -p ~/.ongoing/envs/${ENV}/dumps
	docker run -i \
		--platform linux/amd64 \
	    --network ongoing_default \
		${LOCAL_POSTGRES_IMAGE} \
		/bin/bash \
		-c "PGPASSWORD=${PASSWORD} pg_dump -h db-proxy --username postgres --data-only --no-acl" \
		> ~/.ongoing/envs/${ENV}/dumps/dump.sql

db-up:
	make db-migrate-local MIGRATION=1

# Run this, then `make db-up`
db-clean:
	docker-compose stop postgres
	docker-compose rm -f postgres
	docker volume rm -f ongoing_postgres

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

# ---

db-scaffold:
	cd Entities && \
		dotnet ef dbcontext scaffold \
			--data-annotations \
			--output-dir src/Entities \
			--context-dir src \
			--context EfContext \
			"Host=ongoing-db;Database=postgres;Username=postgres;Password=p" Npgsql.EntityFrameworkCore.PostgreSQL


db-reset:
	cd Entities && \
		dotnet ef database drop -f && \
		rm -rf Migrations/ && \
		dotnet ef migrations add "Initial migration" && \
		dotnet ef database update

db-update:
	cd Entities && \
		dotnet ef database update
