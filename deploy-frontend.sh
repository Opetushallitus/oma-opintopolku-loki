#!/bin/bash
set -eu

source ./parse_env.sh
deploy_env=$(parseEnv)

cd ./frontend
./deploy.sh "$deploy_env"
