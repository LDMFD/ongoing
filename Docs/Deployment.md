# Choose environment

    make work-on-{staging|prod}

# Sync local secrets

    make pull-secrets

# Dev build deployment to Staging

    make up-<service> to build, push and deploy image

    make up-dashboard
    make up-api

    Dashboard logs: https://console.cloud.google.com/run/detail/europe-west2/ongoing-dashboard/logs?project=ongoing-staging

# Version the current build (tags and pushes Git and Docker tags)

    make release-{api|dashboard} RELEASE=1.2.3

# Deployment to Prod

    make work-on-prod
    make deploy-{api|dashboard} RELEASE=1.2.3
