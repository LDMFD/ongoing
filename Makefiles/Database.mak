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

db-up:
	make _db_migrate MIGRATION=0
	make _db_migrate MIGRATION=1

# Run this, then `make db-up`
db-clean:
	docker-compose stop postgres
	docker-compose rm -f postgres
	docker volume rm -f ongoing_postgres
