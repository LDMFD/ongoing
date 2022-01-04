node-generate-package-lock:
	docker exec -ti ongoing-dash npm i --package-lock-only
	docker cp ongoing-dash:/app/package-lock.json Dashboard/

node-install-package:
	docker exec -ti ongoing-dash npm install ${PACKAGE}
	docker cp ongoing-dash:/app/package.json Dashboard/
	docker cp ongoing-dash:/app/package-lock.json Dashboard/

# todo
node-update-packages:
	docker exec -ti ongoing-dash \
		npm i -g npm-check-updates && \
		ncu -u
