## Node.js

Notes on maintaining the dashboard.

depcheck - check for dependencies that can be removed

    make node-shell
    npx depcheck

## Install a package

    make node-install-package-dash PACKAGE=@material-ui/pickers

## Update packages

    make node-update-packages

## Update package-lock.json

For the front-end:
    
    make node-generate-package-lock-dashboard

For the server:
    
    node-generate-package-lock-server

## Audit

    make node-audit-dashboard
