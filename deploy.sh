#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT_DIR}/.env.production"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"
NGINX_TEMPLATE="${ROOT_DIR}/deploy/nginx.formly.conf.template"
NGINX_RENDERED="${ROOT_DIR}/deploy/nginx.formly.conf"

APP_NAME="${APP_NAME:-formly}"
DOMAIN="${DOMAIN:-}"
APP_SCHEME="${APP_SCHEME:-https}"
CLIENT_PORT="${CLIENT_PORT:-3000}"
SERVER_PORT="${SERVER_PORT:-8000}"
SERVER_HOST="${SERVER_HOST:-127.0.0.1}"
CLIENT_HOST="${CLIENT_HOST:-127.0.0.1}"
POSTGRES_USER="${POSTGRES_USER:-formly_user}"
POSTGRES_DB="${POSTGRES_DB:-formly_db}"
INSTALL_NGINX="${INSTALL_NGINX:-1}"

if [[ -z "${DOMAIN}" && -f "${ENV_FILE}" ]]; then
  DOMAIN="$(grep -E '^DOMAIN=' "${ENV_FILE}" | cut -d '=' -f 2- || true)"
fi

if [[ -z "${DOMAIN}" ]]; then
  echo "Missing DOMAIN. Example:"
  echo "  DOMAIN=formly.example.com ./deploy.sh"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but was not found on this server."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_BIN=(docker compose)
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_BIN=(docker-compose)
  COMPOSE_CMD="docker-compose"
else
  echo "Docker Compose is required but was not found."
  exit 1
fi

generate_password() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 24
  else
    date +%s%N | sha256sum | awk '{print $1}'
  fi
}

APP_URL="${APP_URL:-${APP_SCHEME}://${DOMAIN}}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-$(generate_password)}"
DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}}"

if [[ ! -f "${ENV_FILE}" ]]; then
  cat > "${ENV_FILE}" <<EOF
COMPOSE_PROJECT_NAME=${APP_NAME}
APP_ENV_FILE=.env.production
DOMAIN=${DOMAIN}
APP_URL=${APP_URL}

POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB}
DATABASE_URL=${DATABASE_URL}

SERVER_HOST=${SERVER_HOST}
SERVER_PORT=${SERVER_PORT}
CLIENT_HOST=${CLIENT_HOST}
CLIENT_PORT=${CLIENT_PORT}

NODE_ENV=production
PORT=8000
CORS_ORIGIN=${APP_URL}
ASSETS_BASE_URL=${APP_URL}
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_ASSETS_BASE_URL=${APP_URL}
EOF
  echo "Created ${ENV_FILE}"
else
  echo "Using existing ${ENV_FILE}"
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

mkdir -p "${ROOT_DIR}/deploy"
sed \
  -e "s|__DOMAIN__|${DOMAIN}|g" \
  -e "s|__SERVER_PORT__|${SERVER_PORT}|g" \
  -e "s|__CLIENT_PORT__|${CLIENT_PORT}|g" \
  "${NGINX_TEMPLATE}" > "${NGINX_RENDERED}"

compose() {
  "${COMPOSE_BIN[@]}" --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" "$@"
}

echo "Building Docker images..."
compose build

echo "Starting database..."
compose up -d postgres

echo "Running database migrations..."
compose run --rm server npm run prisma:deploy

echo "Starting application containers..."
compose up -d

if [[ "${INSTALL_NGINX}" == "1" ]]; then
  if command -v nginx >/dev/null 2>&1; then
    echo "Installing Nginx config for ${DOMAIN}..."
    sudo cp "${NGINX_RENDERED}" "/etc/nginx/sites-available/${APP_NAME}.conf"
    sudo ln -sf "/etc/nginx/sites-available/${APP_NAME}.conf" "/etc/nginx/sites-enabled/${APP_NAME}.conf"
    sudo nginx -t
    sudo systemctl reload nginx
  else
    echo "Nginx not found. Rendered config is available at ${NGINX_RENDERED}"
  fi
else
  echo "Skipped Nginx install. Rendered config is available at ${NGINX_RENDERED}"
fi

echo ""
echo "Deployment complete."
echo "App URL: ${APP_URL}"
echo "Client container port: ${CLIENT_HOST}:${CLIENT_PORT}"
echo "Server container port: ${SERVER_HOST}:${SERVER_PORT}"
echo ""
echo "Useful commands:"
echo "  ${COMPOSE_CMD} --env-file .env.production -f docker-compose.prod.yml ps"
echo "  ${COMPOSE_CMD} --env-file .env.production -f docker-compose.prod.yml logs -f"
echo "  ${COMPOSE_CMD} --env-file .env.production -f docker-compose.prod.yml restart"
echo ""
echo "If HTTPS is not configured yet, run Certbot for ${DOMAIN} on your VPS."
