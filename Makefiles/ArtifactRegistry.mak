# Entrypoint
gcp-create-artifact_registry:
	gcloud artifacts repositories create ${REGISTRY_REPO} \
		--repository-format=docker \
		--location=${REGION}
