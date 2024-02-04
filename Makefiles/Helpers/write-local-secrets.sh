#!/bin/bash

# For local dev

CLIENT_ID=`gcloud secrets versions access --secret=firebase-client-key latest|base64`
CLIENT_KEY=`gcloud secrets versions access --secret=firebase-client-id latest`
SENTRY_DSN=`gcloud secrets versions access --secret=sentry-dsn latest`
API_KEY=`gcloud secrets versions access --secret=ongoing-api-key latest`

if [ "$ENV" = "staging" ]; then
    SENTRY_CLIRC=`gcloud secrets versions access --secret=sentry-clirc latest`
fi

cat << EOF > .env
ONGOING_ENV=dev

ONGOING_API_HOST=ongoing-api
ONGOING_API_PORT=8000

POSTGRES_ADDR=ongoing-db
POSTGRES_DB=postgres
POSTGRES_DSN=postgres://postgres:p@ongoing-db:5432/ongoing?sslmode=disable
POSTGRES_PASSWORD=p
POSTGRES_USER=postgres

REACT_APP_ONGOING_API_HOST=http://ongoing-api:8000/api
REACT_APP_ONGOING_DASHBOARD_HOST=http://localhost.amplifa.co.uk:3000
REACT_APP_ONGOING_REACT_FIREBASE_CLIENT_ID=$CLIENT_KEY
REACT_APP_ONGOING_REACT_FIREBASE_CONFIG=$CLIENT_ID
REACT_APP_ONGOING_SENTRY_DSN=$SENTRY_DSN

ONGOING_STORAGE_BUCKET=ongoing-$ENV-docs
ONGOING_STORAGE_CREDENTIAL=\$USER_HOME\$/.ongoing/envs/$ENV/secrets/storage/credential.pem
ONGOING_STORAGE_SA=storage@ongoing-$ENV.iam.gserviceaccount.com

REACT_APP_ONGOING_AUTH_BYPASS=true
EOF


ENV=`cat ~/.ongoing/env.txt`

cat << EOF > env.goland
BUNDEBUG=true
GOPATH=\$PROJECT_DIR\$

ONGOING_ENV=dev

ONGOING_API_HOST=ongoing-api
ONGOING_API_PORT=8000
ONGOING_FIREBASE_CONFIG=\$USER_HOME\$/.ongoing/envs/$ENV/secrets/firebase/key.json
ONGOING_SPICEDB_HOST=localhost:50051
ONGOING_SPICEDB_INSECURE=true
ONGOING_SPICEDB_PSK=spice
ONGOING_SPICEDB_DB=spicedb-local
ONGOING_SUPERUSERS=darren@amplifa.co.uk,paul@amplifa.co.uk

POSTGRES_DB=ongoing-local
POSTGRES_DSN=postgres://postgres:p@localhost:5432/ongoing-local?sslmode=disable
ONGOING_STORAGE_BUCKET=ongoing-$ENV-docs
ONGOING_STORAGE_CREDENTIAL=\$USER_HOME\$/.ongoing/envs/$ENV/secrets/storage/credential.pem
ONGOING_STORAGE_SA=storage@ongoing-$ENV.iam.gserviceaccount.com

ONGOING_API_KEY=$API_KEY
ONGOING_OFFLINE_AUTH=true
EOF

if [ "$ENV" = "staging" ]; then
    cat << EOF > Dashboard/.sentryclirc
$SENTRY_CLIRC
EOF
fi

# For make tf-apply etc.
DO_PAT=`gcloud secrets versions access --secret=do-pat latest`
cat << EOF > ~/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars
do_pat = "${DO_PAT}"
environment = "${ENV}"
EOF

# For cd Infra/Terraform ; terraform apply etc.
cp ~/.ongoing/envs/${ENV}/secrets/digital-ocean/pat.tfvars Infra/Terraform/.auto.tfvars
