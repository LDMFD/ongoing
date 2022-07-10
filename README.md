# Local machine setup

Install Docker.

Install firebase CLI:

    curl -sL https://firebase.tools | upgrade=true bash
    firebase login

Install Dotnet and Entity Framework:

    dotnet tool install --global dotnet-ef

Add the following section to /etc/hosts:

    127.0.0.1 ongoing-db
    127.0.0.1 ongoing-api
    127.0.0.1 localhost.example.com

Choose environment:

    make work-on-{staging|prod}

# Cloud setup

- Create a GCP project
- Link a billing account

## SendGrid setup

- Email API -> Integration Guide -> SMTP Relay
    - Copy the values for Firebase setup later.
- Settings
    - API keys - https://app.sendgrid.com/settings/api_keys
        - This is used as SMTP password in Firebase.
        - Restricted access; permissions:
            - Mail Send
    - Sender Authentication
        - Set up DNS

Permissions:

## Firebase setup

Visit https://console.firebase.google.com

Create Firebase project.

- From project landing page, add a web app
- Go to https://console.cloud.google.com/apis/credentials :
    - Find "OAuth 2.0 Client IDs - Web client (auto created by Google Service)"
        - Copy the Client ID for later as the secret value for `firebase-client-id`.
- Project settings
    - General
        - Environment type: unspecified / prod
        - Set default resource location: europe-west2 for UK
        - Public settings: set name
        - Copy `firebaseConfig` (including the braces; `{...}`) to use later as the secret value for `firebase-client-key`.
    - Integrations
        - Google Analytics TODO
    - Service accounts
        - Firebase admin SDK
            - Copy Firebase service account to `Constants.mk` `FIREBASE_SA_ID_${ENV}`
- Authentication
    - Create account
    - Sign-in method
        - Sign-in providers, enable:
            - Email
                - Passwordless link
                - One account per email address.
            - Google
    - Authorized domains; add:
        - `example.com`
        - `localhost.example.com`
    - Templates:
        - Email address verification
        - SMTP with SendGrid credentials (see https://app.sendgrid.com/guide/integrate/langs/smtp)
            - Sender address: noreply@example.com
            - Host: smtp.sendgrid.net
            - Port: 465
            - Username: apikey
            - Password: ...
            - Security: SSL
- Hosting
    - Map custom domain
        - Add TXT and A records as instructed
    - Add www and redirect

## GCP setup

    # If required:
    make gcp-create-artifact_registry

    # Run this, then enter db password twice when prompted
    make gcp-setup

Then:

- Enable Google Identity Platform and add custom authorized domain;
    https://console.cloud.google.com/apis/credentials/consent/edit?project=ongoing-prod
- In APIs & Services -> Credentials https://console.cloud.google.com/apis/credentials?project=ongoing-prod
    - Edit `OAuth 2.0 Client IDs` -> `Web client (auto created by Google Service)`
    - Add `Authorized redirect URIs` -> `https://example.com/__/auth/handler`

# Local dev

To create .env:

    make print-secrets

### Migrations

Entity Framework:

    cd Entities/
    dotnet ef migrations add "comment"
    dotnet ef database update

Also `dotnet ef database update` to create db.

Populate test data:

    make db-migrate-local MIGRATION=1

Populate only users:

    make db-migrate-local MIGRATION=users

Truncate all tables:

    make db-migrate-local MIGRATION=truncate

Drop DB and re-create:

    make db-clean
    docker-compose up postgres

### Dashboard

    make db-clean
    docker-compose up postgres

    make db-up

    docker-compose up dash

    Visit http://localhost.ongoing.tp1.org:3000/

### Node server

To test the Node server (server.js):

    make build-dashboard
    docker-compose -f docker-compose.prod.yml up

    or docker-compose .. --build

Open a browser at http://localhost:8080/

### API server

The API server has its own Makefile in ApiServer/Makefile

# Dev build deployment to Staging

    make up-<service> to build, push and deploy image

    make up-dashboard
    make up-api

    Dashboard logs: https://console.cloud.google.com/run/detail/europe-west2/ongoing-dashboard/logs?project=ongoing-staging

# Version the current build (tags and pushes Git and Docker tags)

make release-{api|dashboard} VERSION=1.0.1

# Deployment to Prod

make work-on-prod
make deploy-{api|dashboard} VERSION=1.0.1
