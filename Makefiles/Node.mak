# Entrypoint
# Start `docker-compose up dashboard` first, then
# make node-install-package-dash PACKAGE=react-tables
node-install-package-dash:
	make _node-install-package \
		IMAGE=ongoing_dash \
		CONTAINER=ongoing-dash \
		FOLDER=Dashboard \
		PACKAGE=${PACKAGE}
	make _node-generate-package-lock IMAGE=ongoing-dash DEST=Dashboard/

node-install-package-dash-dev:
	make _node-install-package-dev \
		IMAGE=ongoing_dash \
		CONTAINER=ongoing-dash \
		FOLDER=Dashboard \
		PACKAGE=${PACKAGE}
	make _node-generate-package-lock IMAGE=ongoing-dash DEST=Dashboard/

# Entrypoint
node-install-package-server:
	make _node-install-package \
		IMAGE=ongoing_dash-server \
		CONTAINER=ongoing-dash-server \
		FOLDER=DashboardServer \
		PACKAGE=${PACKAGE}
	make _node-generate-package-lock IMAGE=ongoing_dash-server DEST=DashboardServer/

_node-install-package:
	docker exec -ti ongoing-dash npm install ${PACKAGE}
	docker cp ongoing-dash:/app/package.json Dashboard/
	docker cp ongoing-dash:/app/package-lock.json Dashboard/

_node-install-package-dev:
	docker exec -ti ongoing-dash npm install --save-dev ${PACKAGE}
	docker cp ongoing-dash:/app/package.json Dashboard/
	docker cp ongoing-dash:/app/package-lock.json Dashboard/

_node-generate-package-lock:
	docker exec -ti ${IMAGE} npm install --package-lock-only
	docker cp ${IMAGE}:/app/package-lock.json ${DEST}

node-generate-package-lock-dashboard:
	make _node-generate-package-lock IMAGE=ongoing-dash DEST=Dashboard/

node-generate-package-lock-server:
	make _node-generate-package-lock IMAGE=ongoing-server DEST=DashboardServer/

# TODO dashboard server including package-lock.json
node-update-packages:
	docker exec -ti ongoing-dash /app/npm-check-updates.sh
	docker cp ongoing-dash:/app/package.json ${shell pwd}/Dashboard/package.json
	docker cp ongoing-dash:/app/package-lock.json ${shell pwd}/Dashboard/package-lock.json

_node-audit:

node-audit-dashboard:
	make _node-audit IMAGE=ongoing-dash

node-shell:
	docker exec -ti ongoing-dash sh
