# Formly VPS Deployment

This project can be deployed on a VPS with Docker Compose while your host Nginx handles public traffic.

## First Deploy

Clone the repo on the VPS, point your domain DNS to the server, then run:

```bash
DOMAIN=formly.example.com ./deploy.sh
```

The script will:

- create `.env.production` if it does not exist
- build the client and server Docker images
- start Postgres with a persistent Docker volume
- run Prisma migrations
- start the app containers
- render and install an Nginx config when Nginx is available

The script supports both `docker compose` and `docker-compose`.

## Important Variables

You can override defaults when running the script:

```bash
DOMAIN=formly.example.com \
APP_SCHEME=https \
CLIENT_PORT=3000 \
SERVER_PORT=8000 \
./deploy.sh
```

Use `APP_SCHEME=http` only if you are deploying without SSL. For production, keep `https` and run Certbot after the first deploy if your VPS does not already manage certificates.

## Runtime URLs

Nginx proxies one domain:

- `/` to the Next.js client
- `/api` to the Express API
- `/cover` to uploaded cover images served by Express

## Useful Commands

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
docker compose --env-file .env.production -f docker-compose.prod.yml restart
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

To redeploy after pulling code changes:

```bash
git pull
DOMAIN=formly.example.com ./deploy.sh
```
