# Local:
_db_migrate:
	docker run \
		-it \
		--rm \
		--network ongoing_default \
		-v `pwd`/Migrations:/app/migrations \
		-v `pwd`/pgpass:/app/pgpass \
		-e PGPASSFILE=/app/pgpass \
		postgres \
			psql --host=ongoing-db \
				 --dbname=postgres \
				 --username=postgres \
				 --file=/app/migrations/${MIGRATION}.sql

# Against gcp:
xxx_db_migrate:
	docker run -it --rm \
		--name db-migration \
		--network ongoing_default \
		-v `pwd`/Migrations:/app/migrations \
		postgres \
			psql --host=db-proxy \
				 --dbname=postgres \
				 --username=postgres \
				 --password \
				 --file=/app/migrations/${MIGRATION}.sql

# Local:
db-dump:
	docker run -it --rm \
		--name db-dump \
		--network ongoing_default \
		postgres \
			pg_dump --host=db-proxy \
					--dbname=postgres \
					--username=postgres \
					--password

db-up:
	make _db_migrate MIGRATION=0
	make _db_migrate MIGRATION=1

# Run this, then `make db-up`
db-clean:
	docker-compose stop postgres
	docker-compose rm -f postgres
	docker volume rm -f ongoing_postgres

db-proxy:
	docker run -it --rm \
		--name db-proxy \
		--platform linux/amd64 \
		--network ongoing_default \
		-p "5433:5432" \
		-v `pwd`/Config/CloudSql/ongoing-test-54a6bc368aca.json:/config \
		gcr.io/cloudsql-docker/gce-proxy:1.29.0 /cloud_sql_proxy \
		-instances=ongoing-test:us-central1:ongoing-test=tcp:0.0.0.0:5432 \
		-credential_file=/config
