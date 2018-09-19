#!/bin/sh

PROJECT_ROOT="$(pwd)"
AWS_CLI="$(which aws)"
S3_BUCKET_PREFIX="oma-opintopolku-loki-frontend"
ENV="${1:-"dev"}"

build() {
  local project_dir="$1"
  local env="$2"
  echo "Building project $project_dir (environment: $env)"
  cd "$project_dir"
  docker build -t oma-opintopolku-loki-frontend-build .
  docker run oma-opintopolku-loki-frontend-build -v dist:/opt/app/dist "npm run build:$env"
  echo "Done!"
  cd -
}

deploy() {
  local project_dir="$1"
  local s3_bucket="$2"
  local env="$3"
  echo "Deploying project $project_dir to S3 bucket $s3_bucket (environment: $env)"
  $AWS_CLI s3 sync "$project_dir/dist/" "s3://$s3_bucket/"
  echo "Done!"
}

build "$PROJECT_ROOT" "$ENV"
deploy "$PROJECT_ROOT" "$S3_BUCKET_PREFIX-$ENV" "$ENV"