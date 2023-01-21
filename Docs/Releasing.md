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

### Version the current build (tags and pushes Git and Docker tags)

    make release-{api|dashboard} RELEASE=1.2.3

### Deploy to Prod

    make work-on-prod
    make deploy-{api|dashboard} RELEASE=1.2.3
