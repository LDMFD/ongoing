node-generate-package-lock:
	docker exec -ti ongoing-dash npm i --package-lock-only
	docker cp ongoing-dash:/app/package-lock.json Dashboard/

node-install-package:
	docker run -ti ${IMAGE} npm install ${PACKAGE}
	docker cp ${IMAGE}:/app/package.json DashboardServer/
	docker cp ${IMAGE}:/app/package-lock.json DashboardServer/

node-install-package-dash:
	make node-install-package IMAGE=ongoing-dash PACKAGE=${PACKAGE}

node-install-package-server:
	make node-install-package IMAGE=ongoing_dash-server PACKAGE=${PACKAGE}

# todo
node-update-packages:
	docker exec -ti ongoing-dash \
		npm i -g npm-check-updates && \
		ncu -u
