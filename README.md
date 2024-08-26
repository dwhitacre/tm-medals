# Trackmania Medals

Software repository for Trackmania custom medals. For each part of the solution you can run them independently or you run them together using docker, process compose, or helm/k8s.

## Development

### Process Compose

> Note: I've modified the process compose port to be 8999 via an environment variable `PC_PORT_NUM=8999`.

From the root you can kick off the `api`, `db`, `e2e` all in one go. This does not run the db migrations, you want to run those separately.

```
process-compose
```

### Docker Compose

From the root you can kick off the `api`, `db`, and an `nginx` lb in one go. This does not tun the db migrations, you want to run those separately.

```
docker compose up --build
```

### Helm / K8s

This is mostly used for actual infrastructure and probably will not work out of the box with KinD, miniKube, or the like. The default helm charts assume you have the following:

- Secrets and Namespaces precreated
- Ingress Nginx installed in your cluster
- Cert-Manager and Letsencrpyt Cluster Issuers

If you have all that, and get the naming (or value overrides configured), you should be able to deploy the helm charts to your cluster. See the `.github/workflows` for the exact actions.

## Architecture

### Api

The `/api` directory contains a bun webserver to populate the data for the tm-medals.danonthemoon.dev website. This is runs as docker container as well as an simple executable.

- Running locally

```
bun install
bun run watch
```

### Db

The `/db` directory contains the tern migration scripts for managing the database. This is used to bootstrap a local database for development, but also to manage the production database versions.

- Migrating to latest

```
tern migrate
```

- Creating a new migration

```
tern new <name>
tern migrate -d +1
```

- Downgrading

```
tern migrate -d -1
```

### Nginx Lb

The nginx loadbalancer, aka ingress, is simply the public nginx docker image configured with the nginx conf in `ingresssim/nginx.conf`. This is used in the docker compose step to properly emulate how the app and api will behave in a more k8s like environment where the services are behind an ingress-nginx deployment.

This only really should be run directly when composing all the services together via docker compose.
