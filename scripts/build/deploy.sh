#!/bin/bash
# Upload an assembled site (dist/<id>/) to a web host over rsync+ssh.
#   scripts/build/deploy.sh <id> <ssh-host> <remote-dir> [public-url]
#   e.g. deploy.sh igluligaarjuk dreamhost cryomics.org/igluligaarjuk-microbes https://cryomics.org/igluligaarjuk-microbes
# Never uploads serve.py, naming_api.py or any .env. The API key stays on the host in
# ~/.<env_slug>.env (env_slug from api/prompt.json); see docs/deploy.md.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
ID=${1:?usage: deploy.sh <id> <ssh-host> <remote-dir> [public-url]}; HOST=${2:?ssh host}; DIR=${3:?remote dir}; URL=${4:-}
D=$ROOT/dist/$ID
[ -f "$D/index.html" ] || { echo "[ERROR] run assemble_site.sh $ID first" >&2; exit 1; }
# stamp the data scripts with this deploy's time so browsers fetch fresh copies
STAMP=$(date +%s); TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
sed "s/\.js?v=dev\"/.js?v=$STAMP\"/g" "$D/index.html" > "$TMP/index.html"
rsync -a --chmod=F644 "$TMP/index.html" "$HOST:$DIR/index.html"
rsync -a --chmod=D2755,F644 --exclude index.html --exclude '*.py' --exclude '.env' --exclude '*.bak*' "$D/" "$HOST:$DIR/"
echo "[INFO] deployed $ID to $HOST:$DIR"
[ -n "$URL" ] && { curl -s "$URL/api/status"; echo; }
