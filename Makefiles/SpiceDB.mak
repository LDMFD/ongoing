spicedb-init-local:
	docker run -ti --rm \
		--name spicedb-migrator \
		--network ongoing_default \
		--platform linux/amd64 \
		authzed/spicedb:${SPICEDB_VERSION} \
			migrate head \
			--datastore-engine=postgres \
			--datastore-conn-uri="postgres://postgres:p@ongoing-db:5432/spicedb?sslmode=disable"

spicedb-init-remote: import-env
	$(eval PASSWORD := $(shell cat ${HOME}/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	docker run -ti --rm \
		--name spicedb-migrator \
		--network ongoing_default \
		--platform linux/amd64 \
		authzed/spicedb:${SPICEDB_VERSION} \
			migrate head \
			--datastore-engine=postgres \
			--datastore-conn-uri="postgres://postgres:${PASSWORD}@db-proxy:5432/spicedb-${ENV}?sslmode=disable"

spicedb-write-schema-local:
	docker run --rm \
		--mount type=bind,source=${shell pwd}/SpiceDB/permissions.zed,destination=/app/permissions.zed,readonly \
		--name spicedb-schema-writer \
		--network ongoing_default \
		quay.io/authzed/zed:latest \
		--endpoint spicedb:50051 --insecure --token spice schema write /app/permissions.zed

spicedb-write-schema-remote: import-env
	$(eval URI := $(shell gcloud run services describe ongoing-spice \
		--platform managed --region ${REGION} --format 'value(status.url)' | sed s/https:\\/\\/// ))
	$(eval PSK := $(shell cat ${HOME}/.ongoing/envs/${ENV}/secrets/spicedb/preshared-key))
	docker run --rm \
		--mount type=bind,source=${shell pwd}/SpiceDB/permissions.zed,destination=/app/permissions.zed,readonly \
		--name spicedb-schema-writer \
		quay.io/authzed/zed:latest \
		--endpoint ${URI}:443 --token ${PSK} schema write /app/permissions.zed

_spicedb-secrets-create:
	gcloud secrets create spicedb-key --replication-policy="automatic"
	gcloud secrets create spicedb-connection --replication-policy="automatic"
	
_spicedb-psk-cycle: import-env
	mkdir -p ~/.ongoing/envs/${ENV}/secrets/spicedb
	$(eval PRESHARED_KEY := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	echo -n ${PRESHARED_KEY} > ${HOME}/.ongoing/envs/${ENV}/secrets/spicedb/preshared-key
	gcloud secrets versions add spicedb-key --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/spicedb/preshared-key

spicedb-upload-image:
	docker pull --platform=linux/amd64 authzed/spicedb:${SPICEDB_VERSION}
	docker tag authzed/spicedb:${SPICEDB_VERSION} europe-west2-docker.pkg.dev/ongoing-staging/ongoing/spicedb:${SPICEDB_VERSION}
	docker push europe-west2-docker.pkg.dev/ongoing-staging/ongoing/spicedb:${SPICEDB_VERSION}

superusers-setup:
	gcloud secrets create superusers --replication-policy="automatic"

superusers-update:
	SECRET=superusers \
		Makefiles/Helpers/input-secret.sh
