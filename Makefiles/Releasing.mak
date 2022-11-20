_release:
	git tag releases/${SERVICE}/v${VERSION}
	git push origin releases/${SERVICE}/v${VERSION}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:v${VERSION}
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:v${VERSION}

# Usage: make release-api VERSION=1.2.3
release-api:
	make _release SERVICE=api IMAGE=ongoing-api

# Usage: make release-dashboard VERSION=1.2.3
release-dashboard:
	make _release SERVICE=dashboard IMAGE=ongoing_dashboard-server

# Usage: make deploy-api VERSION=1.2.3
deploy-api:
	make _deploy-api SERVICE=ongoing-api TAG=v${VERSION}

# Usage: make deploy-dashboard VERSION=1.2.3
deploy-dashboard:
	make _deploy-dashboard SERVICE=ongoing-dashboard TAG=v${VERSION}

push-image:
	$(eval UUID := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	
	gcloud auth configure-docker ${REGISTRY_HOST}

	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${UUID}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest

	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${UUID}	
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest
