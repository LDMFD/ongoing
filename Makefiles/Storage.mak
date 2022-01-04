gcloud-storage-create-service-account:
	gcloud iam service-accounts create storage

gcloud-storage-create-key:
	gcloud iam service-accounts keys create key-file \
		--iam-account=storage@ongoing-test.iam.gserviceaccount.com

gcloud-storage-create-bucket:
	gsutil mb gs://ongoing-test-docs

gcloud-storage-create-principle:
	gsutil iam ch \
		serviceaccount:storage@ongoing-test.iam.gserviceaccount.com:roles/storage.objectAdmin \
		gs://ongoing-test-docs

gcloud-storage-get-cors:
	gsutil cors get gs://ongoing-test-docs|jq

gcloud-storage-set-cors:
	gsutil cors set Config/Storage/CORS.json gs://ongoing-test-docs
