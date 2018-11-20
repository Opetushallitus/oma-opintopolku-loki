#!/bin/sh

PROJECT_ROOT="$(pwd)"
AWS_CLI="$(which aws)"
S3_BUCKET_PREFIX="oma-opintopolku-loki-frontend"
DOCKER_IMAGE_NAME="oma-opintopolku-loki-frontend-build"
ENV="${1:-"dev"}"

build() {
  local project_dir="$1"
  local docker_image_name="$2"
  local env="$3"
  echo "Building project $project_dir (environment: $env)"
  cd "$project_dir"
  docker build -t "$docker_image_name" .
  docker run -v "$project_dir/dist:/opt/app/dist" -e "API_BASE_URL" "$docker_image_name" "build:prod"
  echo "Done!"
  cd -
}

deploy() {
  local project_dir="$1"
  local s3_bucket="$2"
  local env="$3"
  echo "Deploying project $project_dir to S3 bucket $s3_bucket (environment: $env)"
  $AWS_CLI s3 --profile oph-koski-$ENV sync "$project_dir/dist/" "s3://$s3_bucket/"
  echo "Done!"
}

build "$PROJECT_ROOT" "$DOCKER_IMAGE_NAME" "$ENV"
deploy "$PROJECT_ROOT" "$S3_BUCKET_PREFIX-$ENV" "$ENV"
