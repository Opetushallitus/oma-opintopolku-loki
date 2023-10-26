#!/bin/bash

function parseEnv {
  local -r deploy_env="${1:-dev}"
  local -r envs=("dev" "qa" "prod")

  if [[ ! " ${envs[*]} " == *" $deploy_env "* ]]; then
    echo "The env should be one of dev, qa or prod."
    exit 1
  else
    echo "$deploy_env"
  fi
}
