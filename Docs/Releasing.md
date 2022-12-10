## API

make work-on-staging
make release-api RELEASE=1.2.3
make up-api RELEASE=1.2.3

make work-on-prod
make cloudrun-deploy-api && make firebase-deploy

## Dashboard

make work-on-staging
make release-dashboard RELEASE=1.2.3
make up-dashboard RELEASE=1.2.3

make work-on-prod
make cloudrun-deploy-dashboard && make firebase-deploy
