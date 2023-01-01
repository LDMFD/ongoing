_api-setup:
	make _api-create-secret
	make api-update-secret

_api-create-secret: import-env
	gcloud secrets create ongoing-api-key --replication-policy="automatic"

api-update-secret:
	SECRET=ongoing-api-key \
		Makefiles/Helpers/input-secret.sh
