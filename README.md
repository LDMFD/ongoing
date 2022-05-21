# Local machine setup

Install Docker.

Install firebase CLI:

    curl -sL https://firebase.tools | upgrade=true bash
    firebase login

Install Dotnet and Entity Framework:

    dotnet tool install --global dotnet-ef

Add the following domains to /etc/hosts:

- ongoing-db
- ongoing-api
- localhost.<your domain>

Choose environment:

    make work-on-{test|staging}

# Cloud setup
## Firebase setup

Visit https://console.firebase.google.com

Create Firebase project.

- Auth
    - Enable Google and Email auth. One account per email address.
    - Add authorized domains;
        - <your domain> e.g. example.com
        - localhost.<your domain>
    - Enable SMTP with SendGrid credentials.
    - Jump to IAM principals - find Firebase user, put in `Constants.mk` `FIREBASE_SA_ID_${ENV}`
- Add a web app, copy the firebaseConfig object, from the { to the }
- Retrieve from https://console.cloud.google.com/apis/credentials :
    - OAuth 2.0 Client IDs - Web client (auto created by Google Service)
    - Run `make firebase-set-client-id` and paste it in.
- Retrieve the `firebaseConfig` json object from the Firebase console project settings page,
  then run `firebase-set-client-key` and paste it in.
- Connect custom domain

## GCP setup

    # If required:
    make gcp-create-artifact_registry

    # Run this, then enter db password twice when prompted
    make gcp-setup

## SendGrid setup

Generate API key; this is used as SMTP password.

Then:

    make gcp-setup
    make firebase-set-client-key

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

# Routine deployment

    make up-<service> to build, push and deploy image

    make up-dashboard
    make up-api

    Dashboard logs: https://console.cloud.google.com/run/detail/europe-west2/ongoing-dashboard/logs?project=ongoing-staging
