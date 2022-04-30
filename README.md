GCP setup

- APIs and services
    - OAuth 2.0 Client IDs
        - Ongoing Suitability (Test)
    - OAuth consenst screen
    - Domain verification
- Enable the IAM API
- Secret Manager
    - db-key        from Config/CloudSql
    - firebase-key  from Config/Firebase/key.json
- Cloud SQL
    - ongoing-test instance (public IP)
- Cloud Run
    - Domain mappings
        - ong-api.tp1.org -> ongoing-api
        - ongoing.tp1.org -> ongoing-dashboard
    - Services
        - ongoing-api:
            - Container:
                us-central1-docker.pkg.dev/ongoing-test/ongoing-test/ongoing-api:latest (port 8000)
            - Port: 8000
            - Env vars:
                ONGOING_API_HOST=api.ongoing.tp1.org
                ONGOING_GOOGLE_SSO_CLIENT_ID=861652755190-5fevltdq3ls6ftl715gnnaj3be4t7hkm.apps.googleusercontent.com
                GOOGLE_APPLICATION_CREDENTIALS=/app/Config/Firebase/key.json
                STORAGE_CREDENTIAL=/app/Config/Storage/Credentials/Storage.pem
                STORAGE_SA=storage@ongoing-test.iam.gserviceaccount.com
                STORAGE_BUCKET=ongoing-test-docs
                POSTGRES_DSN=unix://postgres:a1xDlslzHuaH1HpP@/cloudsql/ongoing-test:us-central1:ongoing-test/.s.PGSQL.5432?sslmode=disable
            - Secrets:
                firebase-key mounted at /app/Config/Firebase (specified path "key.json")
                storage-key mounted at /app/Config/Storage/Credentials (specified path "Storage.pem")
            - Connections:
                Cloud SQL: ongoing-test:us-central1:ongoing-test
            - Security:
                Service account: ongoing-cloud-run-deployment
        - ongoing-dash-server
            - Container:
                us-central1-docker.pkg.dev/ongoing-test/ongoing-test/ongoing_dash-server:latest (port 8080)
            - Port: 8080
            - Security:
                (Compute Engine default service account - need to change)
    - Cloud Storage
        - ongoing-test-docs
            See Makefiles/Storage.mak

Local dev

    make db-clean
    docker-compose up postgres

    make db-up

    docker-compose up dash

    Visit http://localhost.ongoing.tp1.org:3000/

Deployment

    make up-<service> to build, push and deploy image

    make up-dashboard
    make up-api
