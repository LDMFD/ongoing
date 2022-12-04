# Used for building the API (see Deploy.mak)
build-image:
	docker-compose build --build-arg RELEASE=${RELEASE} --no-cache ${SERVICE}

build-dashboard:
	rm -rf DashboardServer/build

	docker-compose -f docker-compose.prod.yml build --no-cache \
		--build-arg RELEASE=${RELEASE} \
		react-dashboard-builder
	
	docker-compose -f docker-compose.prod.yml run react-dashboard-builder
	
	mv Dashboard/build/index.html DashboardServer/
	mv Dashboard/build DashboardServer/
	find DashboardServer/build/ -name *.map -delete

	docker-compose -f docker-compose.prod.yml build --no-cache \
		--build-arg RELEASE=${RELEASE} \
		dashboard-server

cloc:
	cloc ApiServer/src Dashboard/src Entities/src Makefiles/
