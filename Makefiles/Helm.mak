helm-upgrade:
	cd Infra/Helm && \
		helm upgrade ongoing-api ongoing-api

helm-uninstall:
	cd Infra/Helm && \
		helm uninstall ongoing-api
