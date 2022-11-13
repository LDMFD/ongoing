db-truncate-local:
	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} /bin/bash \
		-c "PGPASSWORD=p psql -U postgres -h ongoing-db -c    'drop database \"ongoing-local\" with (force);'"
	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} /bin/bash \
		-c "PGPASSWORD=p psql -U postgres -h ongoing-db -c    'drop database \"spicedb-local\" with (force);'"
	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} /bin/bash \
		-c "PGPASSWORD=p psql -U postgres -h ongoing-db -c    'create database \"ongoing-local\";'"
	docker run -i --platform linux/amd64 --network ongoing_default ${LOCAL_POSTGRES_IMAGE} /bin/bash \
		-c "PGPASSWORD=p psql -U postgres -h ongoing-db -c    'create database \"spicedb-local\";'"

db-truncate-staging:
	$(eval PASSWORD := $(shell cat ~/.ongoing/envs/staging/secrets/cloud-sql/password))
	docker run -i --platform linux/amd64 --network ongoing_default         ${LOCAL_POSTGRES_IMAGE} /bin/bash \
			-c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -c 'drop database \"ongoing-staging\" with (force);'"
	docker run -i --platform linux/amd64 --network ongoing_default         ${LOCAL_POSTGRES_IMAGE} /bin/bash \
			-c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -c 'drop database \"spicedb-staging\" with (force);'"
	docker run -i --platform linux/amd64 --network ongoing_default         ${LOCAL_POSTGRES_IMAGE} /bin/bash \
			-c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -c 'create database \"ongoing-staging\";'"
	docker run -i --platform linux/amd64 --network ongoing_default         ${LOCAL_POSTGRES_IMAGE} /bin/bash \
			-c "PGPASSWORD=${PASSWORD} psql -U postgres -h db-proxy -c 'create database \"spicedb-staging\";'"
