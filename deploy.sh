#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ROOT_DIR}/.env.production"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"
NGINX_TEMPLATE="${ROOT_DIR}/deploy/nginx.formly.conf.template"
NGINX_RENDERED="${ROOT_DIR}/deploy/nginx.formly.conf"

DOMAIN_OVERRIDE="${DOMAIN:-}"
APP_SCHEME_OVERRIDE="${APP_SCHEME:-}"
APP_URL_OVERRIDE="${APP_URL:-}"
CLIENT_PORT_OVERRIDE="${CLIENT_PORT:-}"
SERVER_PORT_OVERRIDE="${SERVER_PORT:-}"
CLIENT_HOST_OVERRIDE="${CLIENT_HOST:-}"
SERVER_HOST_OVERRIDE="${SERVER_HOST:-}"
POSTGRES_USER_OVERRIDE="${POSTGRES_USER:-}"
POSTGRES_PASSWORD_OVERRIDE="${POSTGRES_PASSWORD:-}"
POSTGRES_DB_OVERRIDE="${POSTGRES_DB:-}"
DATABASE_URL_OVERRIDE="${DATABASE_URL:-}"
JWT_SECRET_OVERRIDE="${JWT_SECRET:-}"

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
JWT_SECRET="${JWT_SECRET:-$(generate_password)$(generate_password)}"

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
JWT_SECRET=${JWT_SECRET}
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

DOMAIN="${DOMAIN_OVERRIDE:-${DOMAIN}}"
APP_SCHEME="${APP_SCHEME_OVERRIDE:-${APP_SCHEME}}"
APP_URL="${APP_URL_OVERRIDE:-${APP_URL}}"
CLIENT_PORT="${CLIENT_PORT_OVERRIDE:-${CLIENT_PORT}}"
SERVER_PORT="${SERVER_PORT_OVERRIDE:-${SERVER_PORT}}"
CLIENT_HOST="${CLIENT_HOST_OVERRIDE:-${CLIENT_HOST}}"
SERVER_HOST="${SERVER_HOST_OVERRIDE:-${SERVER_HOST}}"
POSTGRES_USER="${POSTGRES_USER_OVERRIDE:-${POSTGRES_USER}}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD_OVERRIDE:-${POSTGRES_PASSWORD}}"
POSTGRES_DB="${POSTGRES_DB_OVERRIDE:-${POSTGRES_DB}}"
DATABASE_URL="${DATABASE_URL_OVERRIDE:-${DATABASE_URL}}"
JWT_SECRET="${JWT_SECRET_OVERRIDE:-${JWT_SECRET}}"
export DOMAIN APP_SCHEME APP_URL CLIENT_PORT SERVER_PORT CLIENT_HOST SERVER_HOST
export POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB DATABASE_URL JWT_SECRET

mkdir -p "${ROOT_DIR}/deploy"

SSL_CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
SSL_KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"
SSL_OPTIONS="/etc/letsencrypt/options-ssl-nginx.conf"
SSL_DHPARAM="/etc/letsencrypt/ssl-dhparams.pem"

if [[ -f "${SSL_CERT}" && -f "${SSL_KEY}" ]]; then
  cat > "${NGINX_RENDERED}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ${DOMAIN};

    ssl_certificate ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};
    include ${SSL_OPTIONS};
    ssl_dhparam ${SSL_DHPARAM};

    client_max_body_size 25m;

    location /api/ {
        proxy_pass http://127.0.0.1:${SERVER_PORT}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location = /api {
        proxy_pass http://127.0.0.1:${SERVER_PORT}/api;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /cover/ {
        proxy_pass http://127.0.0.1:${SERVER_PORT}/cover/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:${CLIENT_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
  echo "Rendered HTTPS Nginx config for ${DOMAIN}"
else
  sed \
    -e "s|__DOMAIN__|${DOMAIN}|g" \
    -e "s|__SERVER_PORT__|${SERVER_PORT}|g" \
    -e "s|__CLIENT_PORT__|${CLIENT_PORT}|g" \
    "${NGINX_TEMPLATE}" > "${NGINX_RENDERED}"
  echo "Rendered HTTP Nginx config for ${DOMAIN}. Run Certbot once to enable HTTPS."
fi

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
