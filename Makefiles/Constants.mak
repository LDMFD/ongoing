REGION								:= europe-west2
ZONE								:= ${REGION}-a

REGISTRY_HOST						:= ${REGION}-docker.pkg.dev
REGISTRY_PROJECT					:= ongoing-staging
REGISTRY_REPO						:= ongoing

GCP_PROJECT_prod					:= ongoing-prod
GCP_PROJECT_staging					:= ongoing-staging

DB_INSTANCE_prod					:= ongoing-prod
DB_INSTANCE_staging					:= ongoing-staging2

POSTGRES_VERSION					:= POSTGRES_14
POSTGRES_VERSION_NUMERIC			:= 14.2
SQL_PROXY_VERSION					:= 1.29.0
LOCAL_POSTGRES_IMAGE				:= postgres:14.2

API_IMAGE							:= ongoing-api

FIREBASE_SA_ID_staging				:= firebase-adminsdk-tqmwj@ongoing-staging.iam.gserviceaccount.com	
FIREBASE_SA_ID_prod					:= firebase-adminsdk-uivho@ongoing-prod.iam.gserviceaccount.com

ARTIFACTORY_SA_ID_prod				:= firebase-adminsdk-uivho@ongoing-prod.iam.gserviceaccount.com

DOMAIN_staging						:= ongoing.tp1.org
DOMAIN_prod							:= amplifa.co.uk

SECRET_DATABASE_CONNECTION_staging	:= 4
SECRET_DATABASE_CONNECTION_prod		:= 7

SECRET_DATABASE_PASSWORD_staging	:= 2
SECRET_DATABASE_PASSWORD_prod		:= 3

SECRET_DB_PROXY_VERSION_staging		:= 1
SECRET_DB_PROXY_VERSION_prod		:= 1

SECRET_FIREBASE_CLIENT_ID_staging	:= 1
SECRET_FIREBASE_CLIENT_ID_prod		:= 1

SECRET_FIREBASE_CLIENT_KEY_staging	:= 1
SECRET_FIREBASE_CLIENT_KEY_prod		:= 2

SECRET_FIREBASE_SA_KEY_staging		:= 1
SECRET_FIREBASE_SA_KEY_prod			:= 1

SECRET_STORAGE_CREDENTIAL_staging	:= 1
SECRET_STORAGE_CREDENTIAL_prod		:= 1

