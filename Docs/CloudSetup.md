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

Set up static file serving for the React app bundles:

- Follow the steps in https://cloud.google.com/storage/docs/hosting-static-website

If required:

    make gcp-create-artifact_registry

Run this, then enter db password twice when prompted:

    make gcp-setup

Then:

- Enable Google Identity Platform and add custom authorized domain;
    https://console.cloud.google.com/apis/credentials/consent/edit?project=ongoing-prod
- In APIs & Services -> Credentials https://console.cloud.google.com/apis/credentials?project=ongoing-prod
    - Edit `OAuth 2.0 Client IDs` -> `Web client (auto created by Google Service)`
    - Add `Authorized JavaScript origins` -> `https://portal.amplifa.co.uk`
      and possibly `http://localhost` or `http://localhost:5000`
    - Add `Authorized redirect URIs` -> `https://example.com/__/auth/handler`
- Set up Prod -> Staging daily copying using Data Transfer service on Prod.

## Sentry setup

- Create an org
- Create a project
- Run `make work-on-staging`
- Run `make sentry-create-secrets`
- For the first secret, `sentry-dsn`, use the DSN from Project Settings -> Client Keys (DSN)
- For the second secret, `sentry-clirc`, visit User Settings -> Auth Tokens, create an 
  auth token with the scope `project:releases`, and then use the following template:

    [defaults]
    project=<your project>
    org=<your org>

    [auth]
    token=<your oauth token>
- Run `make work-on-staging` once again to pull the secret to a local cache in `Dashboard/.sentryclirc`
