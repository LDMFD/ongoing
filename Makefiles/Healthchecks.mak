healthcheck-local:
	curl localhost:8000/api/healthcheck
	@echo

healthcheck-remote:
	curl https://portal.amplifa.co.uk/api/healthcheck
	@echo
