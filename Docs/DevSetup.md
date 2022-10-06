# Local machine setup

Install Docker.

Install firebase CLI:

    curl -sL https://firebase.tools | upgrade=true bash
    firebase login

Install Dotnet and Entity Framework:

    dotnet tool install --global dotnet-ef

Add the following section to /etc/hosts:

    127.0.0.1 ongoing-db
    127.0.0.1 ongoing-api
    127.0.0.1 localhost.example.com

# JetBrains GoLand setup

- Run configurations:
  - Go Build: "Run API"
    - Configuration
      - Run kind: Directory
      - Directory: .../ongoing/ApiServer/src (absolute on my machine but should be relative)
      - Working directory: .../ongoing/ApiServer
      - Environment: GOOS=darwin;GOARCH=arm64
      - Module: ApiServer
    - EnvFile (extension)
        - Process JetBrains path macro references: enable
        - List: include path .../ongoing/env.goland, type '.env'
  - Go Test: "Run Tests"
    - Configuration
        - Test framework: gotest
        - Test kind: Package
        - Package path: ongoing
        - Working directory: .../ongoing/ApiServer/src
        - Go tool arguments: -failfast -tags testing
        - Module: ApiServer
    - EnvFile (same as above)

# Choose environment

    make work-on-{staging|prod}

# Migrations

Entity Framework:

    cd Entities/
    dotnet ef migrations add "comment"
    dotnet ef database update

or `make db-update`

# Node server

To test the Node server (server.js):

    make build-dashboard
    docker-compose -f docker-compose.prod.yml up

    or docker-compose .. --build

Open a browser at http://localhost:8080/

# API server

The API server has its own Makefile in ApiServer/Makefile; this is used for wire and package installation.

# Dev cycle - API server & dashboard

This tutorial assumes Go is locally installed, but Node is not.

Create the database network by running `docker-compose up postgres` and then hitting ctrl-c.

## Option 1: pull DB from staging/prod.

    Terminal #1: make work-on-staging
    Terminal #2: make db-proxy
    Terminal #3: make db-dump-remote
    Terminal #2: ctrl-c
    Terminal #1: docker-compose up postgres spicedb dashboard
    Terminal #3: make db-restore-local

## Option 2: start from scratch

    Terminal #1: docker-compose up postgres dashboard # create databases
    Terminal #2: make spicedb-init                    # create spicedb tables 
    Terminal #2: make spicedb-init-local              # create SpiceDB DB
    Terminal #3: docker-compose up spicedb            # run SpiceDB
    Terminal #2: make spicedb-write-schema            # write SpiceDB relations and permissions
    Terminal #4: make work-on-prod                    # write env.goland
    Terminal #4: make db-update                       # create service tables

Then open ApiServer in GoLand and run the target "Run API" or "Run Tests".

### To clean.

    docker-compose down
    docker volume rm ongoing_postgres

If Go is not installed locally, `docker-compose up api` can be used.

To test the dashboard, visit http://localhost.ongoing.tp1.org:3000/

# Running tests with offline auth

Environment setup:

- In `env.goland`, add `OFFLINE_AUTH=true`.
- In `.env`, add `REACT_APP_ONGOING_AUTH_BYPASS=true`. 

Then, in GoLand, run the normal targets.
