db-create-local:
	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} /bin/bash \
		-c "PGPASSWORD=p psql -U postgres -h ongoing-db -c    'create database \"ongoing-local\";'"
	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} /bin/bash \
		-c "PGPASSWORD=p psql -U postgres -h ongoing-db -c    'create database \"spicedb-local\";'"


# Not necessary - `dotnet ef database update` does this
db-create-remote: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	docker run -i \
	    --network ongoing_default \
		--platform linux/amd64 \
        ${LOCAL_POSTGRES_IMAGE} \
            /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -c 'create database \"ongoing-${ENV}\";'"

_db-create-remote-spicedb: import-env
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	docker run -i \
	    --network ongoing_default \
		--platform linux/amd64 \
        ${LOCAL_POSTGRES_IMAGE} \
            /bin/bash \
            -c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -c 'create database \"spicedb-${ENV}\";'"
