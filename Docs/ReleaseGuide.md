# Staging & Release Process

## Test

### Setup

    make work-on-staging
    make pull-secrets

### Build & deploy to Staging

    # make up-<service> to build, push and deploy image

    make up-dashboard
    make up-api

# Release

    # Run:

    make release-{api|dashboard} RELEASE=1.2.3

Which does the following:

- Versions the current build (tags and pushes Git and Docker tags)
- Switches to Prod env
- Deploys
- Switches back to Staging env


### Deploy to Prod

    make work-on-prod
    make deploy-{api|dashboard} RELEASE=1.2.3


Remember to delete Staging containers to save costs if not needed.
