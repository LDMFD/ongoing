#!/bin/bash

CLIENT_ID=`gcloud secrets versions access --secret=firebase-client-key latest|base64`
CLIENT_KEY=`gcloud secrets versions access --secret=firebase-client-id latest`

cat << EOF > .env
REACT_APP_ONGOING_API_HOST=http://ongoing-api:8000/api
REACT_APP_ONGOING_DASHBOARD_HOST=http://localhost.ongoing.tp1.org:3000
REACT_APP_ONGOING_REACT_FIREBASE_CLIENT_ID=$CLIENT_KEY
REACT_APP_ONGOING_REACT_FIREBASE_CONFIG=$CLIENT_ID
REACT_APP_ONGOING_AUTH_BYPASS=false

POSTGRES_DSN=postgres://postgres:p@ongoing-db:5432/postgres?sslmode=disable
ONGOING_API_HOST=ongoing-api
ONGOING_API_PORT=8000
STORAGE_BUCKET=ongoing-$ENV-docs
STORAGE_CREDENTIAL=\$USER_HOME\$/.ongoing/envs/$ENV/secrets/storage/credential.pem
STORAGE_SA=storage@ongoing-$ENV.iam.gserviceaccount.com

POSTGRES_ADDR=ongoing-db
POSTGRES_DB=postgres
POSTGRES_PASSWORD=p
POSTGRES_USER=postgres
EOF


ENV=`cat ~/.ongoing/env.txt`

cat << EOF > env.goland
BUNDEBUG=true
FIREBASE_CONFIG=\$USER_HOME\$/.ongoing/envs/$ENV/secrets/firebase/key.json
GOPATH=\$PROJECT_DIR\$
ONGOING_API_HOST=ongoing-api
ONGOING_API_PORT=8000
POSTGRES_DSN=postgres://postgres:p@localhost:5432/postgres?sslmode=disable
POSTGRES_DB=postgres
STORAGE_BUCKET=ongoing-$ENV-docs
STORAGE_CREDENTIAL=\$USER_HOME\$/.ongoing/envs/$ENV/secrets/storage/credential.pem
STORAGE_SA=storage@ongoing-$ENV.iam.gserviceaccount.com
ONGOING_SPICEDB_INSECURE=true
ONGOING_SPICEDB_HOST=localhost:50051
ONGOING_SPICEDB_PSK=spice
ONGOING_SUPERUSERS=darren@tp1.org,paul@amplifa.co.uk

OFFLINE_AUTH=false
OFFLINE_TESTS=false
TRUNCATE_DB=false
EOF
