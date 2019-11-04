#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
repo="$( cd "$( dirname "$0" )" && pwd )"

function main {
  require_command docker "On macOS: brew cask install docker"
  require_command pyenv "On macOS: brew install pyenv"
  require_command pipenv "On macOS: brew install pipenv"
  require_command mvn "On macOS: brew install maven"

  docker ps > /dev/null || { echo >&2 "Could not connect to docker daemon"; exit 1; }

  init_nodejs
  init_python

  require_command aws

  cd "$repo/api"
  make deploy env=$ENV

  cd "$repo/parser"
  make test
  make scalastyle
  make deploy env=$ENV

  cd "$repo/frontend"
  npm install
  npm run lint
  cp "$repo/frontend/.env-example" "$repo/frontend/.env"
  npm run unit
  npm run test
  ./deploy.sh "$ENV"

}

function init_nodejs {
  local node_version="8"

  export NVM_DIR="${NVM_DIR:-$HOME/.cache/nvm}"
  source "$repo/nvm.sh"
  nvm use $node_version || nvm install $node_version
}

function init_python {
  export VIRTUAL_ENV_DISABLE_PROMPT=1 ## https://github.com/pypa/virtualenv/issues/1029
  pushd "$repo"
  pipenv install
  source "$(pipenv --venv)/bin/activate"
  popd
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
