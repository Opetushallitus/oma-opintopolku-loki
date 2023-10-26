#!/bin/bash
set -eu

source ./parse_env.sh
deploy_env=$(parseEnv)

cd ./parser
make deploy env="$deploy_env"
