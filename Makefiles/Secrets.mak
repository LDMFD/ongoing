print-secrets: import-env
	$(eval CLIENT_ID := $(shell gcloud secrets versions access --secret=firebase-client-key latest|base64))
	$(eval CLIENT_KEY := $(shell gcloud secrets versions access --secret=firebase-client-id latest))

	@echo "Copy to .env:"
	@echo

	@echo REACT_APP_ONGOING_API_HOST=http://ongoing-api:8000/api
	@echo REACT_APP_ONGOING_DASHBOARD_HOST=localhost:3000
	@echo REACT_APP_ONGOING_REACT_FIREBASE_CLIENT_ID=${CLIENT_KEY}
	@echo REACT_APP_ONGOING_REACT_FIREBASE_CONFIG=${CLIENT_ID}

	@echo
	@echo "Copy to env.goland:"
	@echo

	@echo BUNDEBUG=true
	@echo FIREBASE_CONFIG=\$$USER_HOME\$$/.ongoing/secrets/firebase-key.json
	@echo GOPATH=\$$PROJECT_DIR\$$/ApiServer
	@echo ONGOING_API_HOST=ongoing-api
	@echo ONGOING_API_PORT=8000
	@echo POSTGRES_DSN=postgres://postgres:p@localhost:5432/postgres?sslmode=disable
	@echo STORAGE_BUCKET=ongoing-${ENV}-docs
	@echo STORAGE_CREDENTIAL=\$$USER_HOME\$$/.ongoing/secrets/storage/credential.pem
	@echo STORAGE_SA=storage@ongoing-${ENV}.iam.gserviceaccount.com
	@echo 
	@echo POSTGRES_ADDR=ongoing-db:5432
	@echo POSTGRES_DB=postgres
	@echo POSTGRES_PASSWORD=p
	@echo POSTGRES_USER=postgres

pull-secrets: import-env
	mkdir -p ~/.ongoing/envs/${ENV}/secrets/cloud-sql
	gcloud secrets versions access ${SECRET_DB_PROXY_VERSION_${ENV}}    --secret="db-proxy"            > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/credential.json
	gcloud secrets versions access ${SECRET_DATABASE_CONNECTION_${ENV}} --secret="database-connection" > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/db-connection-unix
	gcloud secrets versions access ${SECRET_DATABASE_PASSWORD_${ENV}}   --secret="database-password"   > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/password
	gcloud secrets versions access ${SECRET_DB_PROXY_VERSION_${ENV}}    --secret="db-proxy"            > ~/.ongoing/envs/${ENV}/secrets/cloud-sql/dbproxy-credentials.json

	mkdir -p ~/.ongoing/envs/${ENV}/secrets/firebase
	gcloud secrets versions access ${SECRET_FIREBASE_CLIENT_ID_${ENV}}  --secret="firebase-client-id"  > ~/.ongoing/envs/${ENV}/secrets/firebase/client-id
	gcloud secrets versions access ${SECRET_FIREBASE_CLIENT_KEY_${ENV}} --secret="firebase-client-key" > ~/.ongoing/envs/${ENV}/secrets/firebase/client-key.json
	gcloud secrets versions access ${SECRET_FIREBASE_SA_KEY_${ENV}}     --secret="firebase-sa-key"     > ~/.ongoing/envs/${ENV}/secrets/firebase/key.json

	mkdir -p ~/.ongoing/envs/${ENV}/secrets/storage
	gcloud secrets versions access ${SECRET_STORAGE_CREDENTIAL_${ENV}}  --secret="storage-credential"  > ~/.ongoing/envs/${ENV}/secrets/storage/credential.pem
