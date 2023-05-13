sentry-create-secrets: import-env
	gcloud secrets create sentry-dsn --replication-policy="automatic"
	gcloud secrets create sentry-clirc --replication-policy="automatic"

sentry-update-secret-dsn:
	SECRET=sentry-dsn \
		Makefiles/Helpers/input-secret.sh

sentry-update-secret-clirc:
	SECRET=sentry-clirc \
		Makefiles/Helpers/input-secret.sh
