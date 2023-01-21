_docker_push:
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${RELEASE}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${RELEASE}
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest

_tag_for_release:
	git tag releases/${SERVICE}/v${RELEASE}
	git push origin releases/${SERVICE}/v${RELEASE}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${RELEASE}
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${RELEASE}

# Usage: make release-api RELEASE=1.2.3
release-api:
	make _tag_for_release SERVICE=api IMAGE=ongoing-api

# Usage: make release-dashboard RELEASE=1.2.3
release-dashboard:
	make _tag_for_release SERVICE=dashboard IMAGE=ongoing-dashboard-server

# Usage: make docker-push-api RELEASE=1.2.3
docker-push-api:
	make _docker_push SERVICE=api IMAGE=ongoing-api

# Usage: make docker-push-dashboard RELEASE=1.2.3
docker-push-dashboard:
	make _docker_push SERVICE=dashboard IMAGE=ongoing-dashboard-server

# Usage: make deploy-api RELEASE=1.2.3
deploy-api:
	make _deploy-api SERVICE=ongoing-api TAG=${RELEASE}
	make firebase-deploy


# Usage: make deploy-dashboard RELEASE=1.2.3
deploy-dashboard:
	make _deploy-dashboard SERVICE=ongoing-dashboard TAG=${RELEASE}

# To correlate a release UUID to a numbered version:
# Usage:
# 	for API:        make check-version SERVICE=api RELEASE=6e9e4
# 	for dashboard:  make check-version SERVICE=dashboard-server RELEASE=b0791
check-version: import-env
	@gcloud artifacts docker images list \
		${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/ongoing-${SERVICE} \
		--include-tags --format=yaml 2>/dev/null | grep ${RELEASE}

check-latest: import-env
	@echo -n "API:       "
	@make check-version SERVICE=api RELEASE=latest
	@echo -n "Dashboard: "
	@make check-version SERVICE=dashboard-server RELEASE=latest
