# Choose environment

    make work-on-{staging|prod}

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
