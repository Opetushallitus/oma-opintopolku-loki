#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
repo="$( cd "$( dirname "$0" )" && pwd )"

function main {
  require_command docker "On macOS: brew cask install docker"
  docker ps > /dev/null || { echo >&2 "Could not connect to docker daemon"; exit 1; }
  require_command mvn "On macOS: brew install maven"
  require_command aws

  cd "$repo/parser"
  init_nodejs
  make test
  make scalastyle
  make deploy env=$ENV

  cd "$repo/frontend"
  init_nodejs
  npm install
  npm run lint
  cp "$repo/frontend/.env-example" "$repo/frontend/.env"
  npm run unit
  npm run test
  ./deploy.sh "$ENV"

}

function init_nodejs {
  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  source "$repo/nvm.sh"
  nvm install $(cat .nvmrc)
}


function require_command {
  command -v "$1" > /dev/null 2>&1 || {
    error "I require '$1' but it's not installed. Aborting."
    if [ "${2:-}" != "" ]; then
      error "$2"
    fi
    exit 1
  }
}

function error {
  echo >&2 "$@"
}

function check_env {
  FILE_NAME=$(basename "$0")
  if echo "${FILE_NAME}" | grep -E -q 'deploy-.{2,4}\.sh'; then
    ENV=$(echo "${FILE_NAME}" | sed -E -e 's|deploy-(.{2,4})\.sh|\1|g')
    export ENV
    echo "Deploying to [${ENV}]"
  else
    echo >&2 "Don't call this script directly"
    exit 1
  fi
}

check_env
main "$@"
