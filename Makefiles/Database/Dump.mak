# In these, change --data-only to --schema-only to control output.
# e.g. --schema-only --no-acl --column-inserts --no-comments
db-dump-local-ongoing:
	mkdir -p ${HOME}/.ongoing/dumps/local
	touch ${HOME}/.ongoing/dumps/local/ongoing.sql
	touch ${HOME}/.ongoing/dumps/local/spicedb.sql

	docker run -it --rm \
		--platform linux/amd64 \
		--name db-dump \
		--network ongoing_default \
		-v ${HOME}/.ongoing/dumps/local/ongoing.sql:/root/dump.sql \
		-v `pwd`/Postgres/pgpass:/root/.pgpass \
		-e PGPASSFILE=/root/.pgpass \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			pg_dump --host=ongoing-db \
					--dbname=ongoing-local \
					--username=postgres \
					--no-comments \
					--file=/root/dump.sql

	docker run -it --rm \
		--platform linux/amd64 \
		--name db-dump \
		--network ongoing_default \
		-v ${HOME}/.ongoing/dumps/local/spicedb.sql:/root/dump.sql \
		-v `pwd`/Postgres/pgpass:/root/.pgpass \
		-e PGPASSFILE=/root/.pgpass \
		postgres:${POSTGRES_VERSION_NUMERIC} \
			pg_dump --host=ongoing-db \
					--dbname=spicedb-local \
					--username=postgres \
					--no-comments \
					--file=/root/dump.sql

db-dump-remote: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	mkdir -p ~/.ongoing/envs/${ENV}/dumps

	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} \
		/bin/bash -c "PGPASSWORD=${PASSWORD} pg_dump -d ongoing-${ENV} \
			-h db-proxy --username postgres --no-acl --column-inserts --no-comments" \
		> ~/.ongoing/envs/${ENV}/dumps/ongoing.sql

	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} \
		/bin/bash -c "PGPASSWORD=${PASSWORD} pg_dump -d spicedb-${ENV} \
			-h db-proxy --username postgres --no-acl --column-inserts --no-comments" \
		> ~/.ongoing/envs/${ENV}/dumps/spicedb.sql
