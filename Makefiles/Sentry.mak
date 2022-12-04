sentry-create-secrets: import-env
	gcloud secrets create sentry-dsn-api --replication-policy="automatic"
	gcloud secrets create sentry-dsn-dashboard --replication-policy="automatic"
	gcloud secrets create sentry-clirc --replication-policy="automatic"

sentry-update-secret-dsn-api:
	SECRET=sentry-dsn-api \
		Makefiles/Helpers/input-secret.sh

sentry-update-secret-dsn-dashboard:
	SECRET=sentry-dsn-dashboard \
		Makefiles/Helpers/input-secret.sh

sentry-update-secret-clirc:
	SECRET=sentry-clirc \
		Makefiles/Helpers/input-secret.sh
