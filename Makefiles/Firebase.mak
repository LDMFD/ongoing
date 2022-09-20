_gcp-firebase-setup:
	make _firebase-create-sa-key
	make _firebase-create-secret-key_json
	make _firebase-create-secret-client_id
	make _firebase-set-client-id
	make _firebase-set-client-key

_firebase-create-sa-key: import-env
	gcloud iam service-accounts keys create ${HOME}/.ongoing/envs/${ENV}/secrets/firebase/firebase-key.json \
		--iam-account=${FIREBASE_SA_ID_${ENV}}

	gcloud secrets create firebase-sa-key \
	    --replication-policy="automatic"

	gcloud secrets versions add firebase-sa-key --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/firebase/firebase-key.json

_firebase-create-secret-key_json: import-env
	gcloud secrets create firebase-client-key \
	    --replication-policy="automatic"

_firebase-create-secret-client_id: import-env
	gcloud secrets create firebase-client-id \
	    --replication-policy="automatic"

_firebase-set-client-id:
	SECRET=firebase-client-id \
		Makefiles/Helpers/input-secret.sh

_firebase-set-client-key:
	SECRET=firebase-client-key \
		Makefiles/Helpers/input-secret.sh

firebase-update-client-key: import-env
	gcloud secrets versions add firebase-client-key --data-file=${HOME}/.ongoing/envs/${ENV}/secrets/firebase/client-key.json


# ---

_gcp-firebase-teardown: import-env
	gcloud iam service-accounts delete ${FIREBASE_SA_ID_${ENV}}
	gcloud secrets delete firebase-sa-key
	gcloud secrets delete firebase-client-key
	gcloud secrets delete firebase-client-id

# ---

# Entrypoint
# To enable better logging, see https://stackoverflow.com/a/65637663
# TOKEN will be ya29...
firebase-enable-logging: import-env
	curl -d "{'monitoring':{'requestLogging':{'enabled':true}}}" \
		-H 'Authorization: Bearer ${TOKEN}' \
		-X PATCH -H 'Content-Type: application/json' \
		https://identitytoolkit.googleapis.com/admin/v2/projects/ongoing-${ENV}/config?updateMask=monitoring.requestLogging.enabled

# ---

firebase-deploy: import-env
	cd Config/Firebase && \
	firebase deploy --only hosting --project ongoing-${ENV}
