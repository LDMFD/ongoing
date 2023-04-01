healthcheck-local:
	curl localhost:8000/api/healthcheck
	@echo

healthcheck-remote-staging:
	curl https://staging.amplifa.co.uk/api/healthcheck
	@echo

healthcheck-remote-prod:
	curl https://portal.amplifa.co.uk/api/healthcheck
	@echo

errorcheck-local:
	curl localhost:8000/api/errorcheck
	@echo

errorcheck-remote:
	curl -v https://portal.amplifa.co.uk/api/errorcheck
	@echo

errorcheck-remote-staging:
	curl -v https://staging.amplifa.co.uk/api/errorcheck

errorcheck-remote-staging-with-auth:
	curl -v https://staging.amplifa.co.uk/api/user/errorcheck -H "Authentication: ${JWT}"

errorcheck-remote-prod:
	curl -v https://portal.amplifa.co.uk/api/errorcheck

stats-local:
	curl --header "Authentication: darren@amplifa.co.uk" -v localhost:8000/api/admin/stats
	@echo
