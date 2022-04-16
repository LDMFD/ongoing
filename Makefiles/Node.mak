node-generate-package-lock:
	docker exec -ti ${IMAGE} npm i --package-lock-only
	docker cp ${IMAGE}:/app/package-lock.json Dashboard/

node-install-package:
	docker exec -ti ${CONTAINER} npm install ${PACKAGE}
	docker cp ${CONTAINER}:/app/package.json ${FOLDER}/
	docker cp ${CONTAINER}:/app/package-lock.json ${FOLDER}/

# Entry point; start `docker-compose up dash` first, then
# make node-install-package-dash PACKAGE=react-tables
node-install-package-dash:
	make node-install-package \
		IMAGE=ongoing_dash \
		CONTAINER=ongoing-dash \
		FOLDER=Dashboard \
		PACKAGE=${PACKAGE}

node-install-package-server:
	make node-install-package \
		IMAGE=ongoing_dash-server \
		CONTAINER=ongoing-dash-server \
		FOLDER=DashboardServer \
		PACKAGE=${PACKAGE}

# todo
node-update-packages:
	docker exec -ti ongoing-dash \
		npm i -g npm-check-updates && \
		ncu -u
