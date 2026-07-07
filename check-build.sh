#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_npm() {
  local app_dir="$1"
  shift

  echo ""
  echo "==> ${app_dir}: npm $*"
  (cd "${ROOT_DIR}/${app_dir}" && npm "$@")
}

require_node_modules() {
  local app_dir="$1"

  if [[ ! -d "${ROOT_DIR}/${app_dir}/node_modules" ]]; then
    echo "Missing ${app_dir}/node_modules. Run this first:"
    echo "  cd ${app_dir} && npm ci"
    exit 1
  fi
}

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required for preflight checks but was not found."
  exit 1
fi

require_node_modules server
require_node_modules client

run_npm server run prisma:generate
run_npm server run build

run_npm client run check

echo ""
echo "Checks passed."
