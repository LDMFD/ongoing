## API

make work-on-staging
make up-api RELEASE=1.2.3

make work-on-prod
make cloudrun-deploy-api

## Dashboard

make work-on-staging
make up-dashboard RELEASE=1.2.3

make work-on-prod
make cloudrun-deploy-dashboard