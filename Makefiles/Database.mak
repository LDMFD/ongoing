# Caller: gcp-init (GCP.mak)
_gcp-sql-setup:
	make _gcp-sql-create
	make _gcp-sql-create-secret
	make _gcp-sql-set-password
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

_gcp-sql-create-secret:
	gcloud secrets create database-connection \
	    --replication-policy="automatic"

_gcp-sql-set-password: import-env
	read -s -p "Enter postgres password:" PASSWORD; \
	echo -n unix://postgres:$$PASSWORD@/cloudsql/ongoing-${ENV}:${REGION}:${DB_INSTANCE_${ENV}}/.s.PGSQL.5432?sslmode=disable \
		| gcloud secrets versions add database-connection --data-file=- ; \
	\
	gcloud sql users set-password postgres \
		--instance=${DB_INSTANCE_${ENV}} \
		--password=$$PASSWORD

# Allow Cloud Run to read secrets and connect to DB
_gcp-allow-cloud-run-to-access-database: import-env
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_${ENV}} \
		--member=serviceAccount:ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--role=roles/secretmanager.secretAccessor

	gcloud projects add-iam-policy-binding ${GCP_PROJECT_${ENV}} \
		--member=serviceAccount:ongoing-${ENV}-cloud-run@ongoing-${ENV}.iam.gserviceaccount.com \
		--role=roles/cloudsql.client

_gcp-create-db-proxy-service-account: import-env
	gcloud iam service-accounts create cloudsql-proxy --display-name "cloudsql-proxy"
	gcloud projects add-iam-policy-binding ${GCP_PROJECT_${ENV}} --member serviceAccount:cloudsql-proxy@${GCP_PROJECT_${ENV}}.iam.gserviceaccount.com --role roles/cloudsql.client
	gcloud iam service-accounts keys create ${HOME}/.ongoing/secrets/dbproxy-credentials.json --iam-account cloudsql-proxy@${GCP_PROJECT_${ENV}}.iam.gserviceaccount.com
	gcloud secrets create db-proxy --replication-policy=automatic --data-file=${HOME}/.ongoing/secrets/dbproxy-credentials.json
#rm ~/.ongoing/secrets/dbproxy-credentials.json

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
db-restore:
	docker run -it --rm \
		--name db-migration \
		--network ongoing_default \
		-v ${FROM}:/app/migrations/dump.sql \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			psql --host=db-proxy \
				 --dbname=postgres \
				 --username=postgres \
				 --password \
				 --file=/app/migrations/dump.sql

# In these, change --data-only to --schema-only to control output.
db-dump-local:
	docker run -it --rm \
		--name db-dump \
		--network ongoing_default \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			pg_dump --host=ongoing-db \
					--dbname=postgres \
					--username=postgres \
					--password \
					--no-comments \
					--schema-only --no-acl --column-inserts --no-comments

db-dump-remote:
	docker run -it --rm \
		--name db-dump \
		--network ongoing_default \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			pg_dump --host=db-proxy \
					--dbname=postgres \
					--username=postgres \
					--password \
					--no-comments \
					--data-only --no-acl --column-inserts --no-comments

db-up:
	make _db_migrate-local MIGRATION=0
	make _db_migrate-local MIGRATION=1

# Run this, then `make db-up`
db-clean:
	docker-compose stop postgres
	docker-compose rm -f postgres
	docker volume rm -f ongoing_postgres

db-proxy: import-env
	mkdir -p ~/.ongoing/secrets
	gcloud secrets versions access ${SECRET_DB_PROXY_VERSION_${ENV}} --secret="db-proxy" > ~/.ongoing/secrets/cloudsql-credential.json
	docker run -it --rm \
		--name db-proxy \
		--platform linux/amd64 \
		--network ongoing_default \
		-p "5433:5432" \
		-v ~/.ongoing/secrets/cloudsql-credential.json:/credential.json \
		gcr.io/cloudsql-docker/gce-proxy:${SQL_PROXY_VERSION} /cloud_sql_proxy \
		-instances=ongoing-${ENV}:${REGION_${ENV}}:${DB_INSTANCE_${ENV}}=tcp:0.0.0.0:5432 \
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
