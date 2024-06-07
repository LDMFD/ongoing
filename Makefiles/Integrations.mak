_integration-plannr-setup: import-env
	gcloud secrets create integration-plannr-client-id      --replication-policy="automatic"
	gcloud secrets create integration-plannr-client-secret  --replication-policy="automatic"

	SECRET=integration-plannr-client-id     Makefiles/Helpers/input-secret.sh
	SECRET=integration-plannr-client-secret Makefiles/Helpers/input-secret.sh
