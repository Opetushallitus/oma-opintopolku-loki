#!/bin/bash
set -euo pipefail

if [ -z "$2" ]; then
  echo "Usage: create-buildversion.sh file version"
  exit 1
fi

file="$1"
version="$2"

if [ "$version" = "1.0-SNAPSHOT" ]; then
  version="local"
fi

cat >"$file" <<EOL
artifactId=oma-opintopolku-loki/parser
version=$version
vcsRevision=$(git rev-parse HEAD)
buildDate=$(date)
EOL
