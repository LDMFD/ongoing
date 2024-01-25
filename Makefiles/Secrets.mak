# For deploying
pull-secrets: import-env
	mkdir -p ~/.ongoing/envs/${ENV}/secrets/cloud-sql
	gcloud secrets versions access ${SECRET_DB_PROXY_VERSION_${ENV}}    --secret="db-proxy"            > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/credential.json
	gcloud secrets versions access ${SECRET_DATABASE_CONNECTION_${ENV}} --secret="database-connection" > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-unix
	gcloud secrets versions access ${SECRET_DATABASE_PASSWORD_${ENV}}   --secret="database-password"   > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password
	gcloud secrets versions access ${SECRET_DB_PROXY_VERSION_${ENV}}    --secret="db-proxy"            > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/dbproxy-credentials.json

	$(eval SQL_PASSWORD := $(shell cat ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password))
	echo -n "postgres://?user=postgres&password=${SQL_PASSWORD}&host=/cloudsql/${GCP_PROJECT_${ENV}}:${REGION}:${DB_INSTANCE_${ENV}}&sslmode=disable&database=spicedb-${ENV}" \
		 > ${HOME}/.ongoing/envs/${ENV}/secrets/spicedb/connection

	mkdir -p ~/.ongoing/envs/${ENV}/secrets/firebase
	gcloud secrets versions access ${SECRET_FIREBASE_CLIENT_ID_${ENV}}  --secret="firebase-client-id"  > ~/.ongoing/envs/${ENV}/secrets/firebase/client-id
	gcloud secrets versions access ${SECRET_FIREBASE_CLIENT_KEY_${ENV}} --secret="firebase-client-key" > ~/.ongoing/envs/${ENV}/secrets/firebase/client-key.json
	gcloud secrets versions access ${SECRET_FIREBASE_SA_KEY_${ENV}}     --secret="firebase-sa-key"     > ~/.ongoing/envs/${ENV}/secrets/firebase/key.json

	mkdir -p ~/.ongoing/envs/${ENV}/secrets/storage
	gcloud secrets versions access ${SECRET_STORAGE_CREDENTIAL_${ENV}}  --secret="storage-credential"  > ~/.ongoing/envs/${ENV}/secrets/storage/credential.pem

	mkdir -p ~/.ongoing/envs/${ENV}/secrets/spicedb
	gcloud secrets versions access ${SECRET_SPICEDB_PSK_${ENV}}         --secret="spicedb-key"         > ~/.ongoing/envs/${ENV}/secrets/spicedb/preshared-key
