_release:
	git tag releases/${SERVICE}/v${RELEASE}
	git push origin releases/${SERVICE}/v${RELEASE}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:v${RELEASE}
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:v${RELEASE}

# Usage: make release-api RELEASE=1.2.3
release-api:
	make _release SERVICE=api IMAGE=ongoing-api

# Usage: make release-dashboard RELEASE=1.2.3
release-dashboard:
	make _release SERVICE=dashboard IMAGE=ongoing_dashboard-server

# Usage: make deploy-api RELEASE=1.2.3
deploy-api:
	make _deploy-api SERVICE=ongoing-api TAG=v${RELEASE}

# Usage: make deploy-dashboard RELEASE=1.2.3
deploy-dashboard:
	make _deploy-dashboard SERVICE=ongoing-dashboard TAG=v${RELEASE}

push-image:
	$(eval UUID := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	
	gcloud auth configure-docker ${REGISTRY_HOST}

	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${UUID}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest

	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${UUID}	
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest
