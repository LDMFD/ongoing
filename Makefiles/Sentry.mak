sentry-create-secret-dsn: import-env
	gcloud secrets create sentry-dsn --replication-policy="automatic"

sentry-update-secret-dsn:
	SECRET=sentry-dsn \
		Makefiles/Helpers/input-secret.sh
