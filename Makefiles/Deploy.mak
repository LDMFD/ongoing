deploy:
	gcloud run deploy ${IMAGE} \
		--image=${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_PROJECT}/${IMAGE}:latest \
		--platform=managed \
		--region=us-central1 \
		--project=ongoing-test
		
	gcloud run services update-traffic ${IMAGE} \
		--region=us-central1 \
		--to-latest

deploy-api:
	make deploy IMAGE=ongoing-api

deploy-dashboard:
	make deploy IMAGE=ongoing-dashboard
