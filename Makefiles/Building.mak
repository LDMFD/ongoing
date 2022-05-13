build-image:
	docker-compose build --no-cache ${SERVICE}

push-image:
	$(eval UUID := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	
	gcloud auth configure-docker ${REGISTRY_HOST}

	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${UUID}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest

	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:${UUID}
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_REPO}/${IMAGE}:latest

up-api:
	make build-image SERVICE=api
	make push-image IMAGE=ongoing-api
	make cloudrun-deploy-api
	make firebase-deploy

build-dashboard:
	rm -rf DashboardServer/build

	docker-compose -f docker-compose.prod.yml build --no-cache react-dashboard-builder
	docker-compose -f docker-compose.prod.yml run react-dashboard-builder
	
	mv Dashboard/build/index.html DashboardServer/
	mv Dashboard/build DashboardServer/
	find DashboardServer/build/ -name *.map -delete

	docker-compose -f docker-compose.prod.yml build --no-cache dashboard-server

make up-dashboard:
	make build-dashboard
	make push-image IMAGE=ongoing_dashboard-server
	make cloudrun-deploy-dashboard
	make firebase-deploy
