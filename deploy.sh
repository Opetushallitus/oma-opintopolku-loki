#!/bin/bash
set -eu

source ./parse_env.sh
deploy_env=$(parseEnv)

./deploy-parser.sh "$deploy_env"
./deploy-frontend.sh "$deploy_env"
