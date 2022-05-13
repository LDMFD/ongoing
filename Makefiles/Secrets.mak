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
	@echo STORAGE_CREDENTIAL=\$$USER_HOME\$$/.ongoing/secrets/storage.pem
	@echo STORAGE_SA=storage@ongoing-${ENV}.iam.gserviceaccount.com
