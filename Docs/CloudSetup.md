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
    - Add `Authorized JavaScript origins` -> `https://portal.amplifa.co.uk`
      and possibly `http://localhost` or `http://localhost:5000`
    - Add `Authorized redirect URIs` -> `https://example.com/__/auth/handler`
- Set up Prod -> Staging daily copying using Data Transfer service on Prod.
