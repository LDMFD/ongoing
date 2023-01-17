Where `<service>` is one of:

- dashboard
- api

The release process is as follows:

    make work-on-staging
    make up-<service>

Test on Staging, then to deploy to Prod:

    make release-<service> RELEASE=1.2.3
    make work-on-prod
    make cloudrun-deploy-<service> TAG=1.2.3
