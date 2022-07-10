_gcp-storage-setup:
	make _gcp-storage-create-service-account
	make _gcp-storage-create-bucket
	make _gcp-storage-create-principle
	make _gcp-storage-set-cors
	make _gcp-storage-create-key
	make _gcp-storage-create-secret

_gcp-storage-create-service-account:
	gcloud iam service-accounts create storage

_gcp-storage-create-bucket: import-env
	gsutil mb -l ${REGION} gs://ongoing-${ENV}-docs

_gcp-storage-create-principle: import-env
	gsutil iam ch \
		serviceaccount:storage@ongoing-${ENV}.iam.gserviceaccount.com:roles/storage.objectAdmin \
		gs://ongoing-${ENV}-docs

_gcp-storage-set-cors: import-env
	gsutil cors set Config/Storage/CORS.json gs://ongoing-${ENV}-docs

# Commands from ApiServer/pkg/mod/cloud.google.com/go/storage@v1.18.2/storage.go
_gcp-storage-create-key: import-env
	gcloud iam service-accounts keys create ~/.ongoing/envs/${ENV}/secrets/storage.p12 \
		--key-file-type=p12 \
		--iam-account=storage@ongoing-${ENV}.iam.gserviceaccount.com	
	openssl pkcs12 -in ~/.ongoing/envs/${ENV}/secrets/storage.p12 -passin pass:notasecret -out ~/.ongoing/envs/${ENV}/secrets/storage/credential.pem -nodes
	rm ~/.ongoing/envs/${ENV}/secrets/storage.p12

_gcp-storage-create-secret: import-env
	gcloud secrets create storage-credential --replication-policy=automatic --data-file=${HOME}/.ongoing/secrets/storage/credential.pem

# ---

# Entrypoint
gcp-storage-update-secret: import-env
	gcloud secrets versions add storage-credential --data-file=${HOME}/.ongoing/secrets/storage2.pem

# ---

_gcp-storage-teardown: import-env
	gcloud iam service-accounts delete storage@ongoing-${ENV}.iam.gserviceaccount.com
	gsutil rm -r gs://ongoing-${ENV}-docs
	gcloud secrets delete storage-credential
	rm ~/.ongoing/envs/${ENV}/secrets/storage/credential.pem
