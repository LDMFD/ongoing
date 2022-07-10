healthcheck-local:
	curl localhost:8000/api/healthcheck
	@echo

healthcheck-remote:
	curl https://amplifa.co.uk/api/healthcheck
	@echo
