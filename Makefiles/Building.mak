build-image:
#docker-compose build ${SERVICE}
	docker-compose build --no-cache ${SERVICE}

push-image:
	$(eval UUID := $(shell uuidgen | tr [:upper:] [:lower:] | tr -d '-'))
	
	gcloud auth configure-docker ${REGISTRY_HOST}

	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_PROJECT}/${IMAGE}:${UUID}
	docker tag ${IMAGE} ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_PROJECT}/${IMAGE}:latest
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_PROJECT}/${IMAGE}:${UUID}
	docker push ${REGISTRY_HOST}/${REGISTRY_PROJECT}/${REGISTRY_PROJECT}/${IMAGE}:latest

up-api:
	make build-image SERVICE=api
	make push-image IMAGE=ongoing-api
	make deploy-api

build-dashboard:
	rm -rf DashboardServer/build

	# Build React app
	docker-compose -f docker-compose.prod.yml build --no-cache dash-builder
	docker-compose -f docker-compose.prod.yml run dash-builder
	mv Dashboard/build DashboardServer/

	find DashboardServer/build/ -name *.map -delete

	# Build server
	docker-compose -f docker-compose.prod.yml build --no-cache dashboard

push-dashboard:
	make push-image IMAGE=ongoing-dashboard

make up-dashboard:
	make build-dashboard
	make push-dashboard
	make deploy-dashboard
