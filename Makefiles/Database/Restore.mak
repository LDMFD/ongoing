db-restore-local-from-prod:
	make _db-restore-local FROM=${HOME}/.ongoing/envs/prod/dumps

db-restore-local-from-staging:
	make _db-restore-local FROM=${HOME}/.ongoing/envs/staging/dumps

_db-restore-local:
	docker run -it --rm --platform linux/amd64 --name db-restorer --network ongoing_default \
		-v ${FROM}/ongoing.sql:/app/ongoing.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=p psql -U postgres -h ongoing-db -d ongoing-local < /app/ongoing.sql"

	docker run -it --rm --platform linux/amd64 --name db-restorer --network ongoing_default \
		-v ${FROM}/spicedb.sql:/app/spicedb.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=p psql -U postgres -h ongoing-db -d spicedb-local < /app/spicedb.sql"

db-restore-remote: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	docker run -i --platform linux/amd64 --network ongoing_default \
		-v ~/.ongoing/envs/${ENV}/dumps/ongoing.sql:/ongoing.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -d ongoing-${ENV} < /ongoing.sql"

	docker run -i --platform linux/amd64 --network ongoing_default \
		-v ~/.ongoing/envs/${ENV}/dumps/spicedb.sql:/spicedb.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -d spicedb-${ENV} < /spicedb.sql"

db-restore-staging-from-local-dump: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	docker run -i --platform linux/amd64 --network ongoing_default \
		-v ~/.ongoing/dumps/local/ongoing.sql:/ongoing.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -d ongoing-staging < /ongoing.sql"

	docker run -i --platform linux/amd64 --network ongoing_default \
		-v ~/.ongoing/dumps/local/spicedb.sql:/spicedb.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -d spicedb-staging < /spicedb.sql"

db-restore-staging-from-prod-dump:
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/staging/secrets/cloud-sql/password))
	docker run -i --platform linux/amd64 --network ongoing_default \
		-v ${HOME}/.ongoing/envs/prod/dumps/ongoing.sql:/ongoing.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -d ongoing-staging < /ongoing.sql"

	docker run -i --platform linux/amd64 --network ongoing_default \
		-v ${HOME}/.ongoing/envs/prod/dumps/spicedb.sql:/spicedb.sql ${LOCAL_POSTGRES_IMAGE} /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -d spicedb-staging < /spicedb.sql"
