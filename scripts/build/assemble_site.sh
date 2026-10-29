#!/bin/bash
# Assemble one community's site into dist/<id>/ : the shared page and API from site/, plus
# that community's data from communities/<id>/. The result is a static folder that
# serve.py can serve locally or deploy.sh can upload.
#   scripts/build/assemble_site.sh <id> [dictionary.js]
# dictionary.js: the community's word list (window.DICTIONARY = [{roman, syllabics, english,
# source}, ...]). Used when given, else communities/<id>/dictionary.js, else an empty list.
# Dictionaries are often licensed and kept out of the repo; pass a private path here.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
ID=${1:?usage: assemble_site.sh <community-id> [dictionary.js]}
SRC=$ROOT/communities/$ID; OUT=$ROOT/dist/$ID
[ -f "$SRC/community.js" ] || { echo "[ERROR] $SRC/community.js not found" >&2; exit 1; }
rm -rf "$OUT"; mkdir -p "$OUT/api"
cp "$ROOT"/site/{index.html,serve.py,naming_api.py,taxon_names.js,iq_tab.js,sheet.js} "$OUT/"
cp "$ROOT"/site/api/{lib.php,protologue.php,status.php,.htaccess} "$OUT/api/"
cp "$SRC/api/prompt.json" "$OUT/api/prompt.json"
for f in community.js candidates.js narratives.js site_data.js; do
    [ -f "$SRC/$f" ] || { echo "[ERROR] missing $SRC/$f" >&2; exit 1; }
    cp "$SRC/$f" "$OUT/"
done
# optional community knowledge tab content (Two Ways of Seeing); the tab is hidden without it
if [ -f "$SRC/iq.js" ]; then cp "$SRC/iq.js" "$OUT/"; else echo "window.IQ_CONTENT = null;" > "$OUT/iq.js"; fi
cp -r "$SRC/img" "$OUT/img"
# shared explainers (pathways, genes, ecosystem services) and their pictures
cp -r "$ROOT/site/explain" "$OUT/explain"
# card game (cards.html + engine, rules, renderer): shared, built from the same data files
cp "$ROOT/site/cards.html" "$OUT/"
cp -r "$ROOT/site/cards" "$OUT/cards"
[ -d "$ROOT/site/img" ] && cp -r "$ROOT/site/img/." "$OUT/img/"
# optional extra pages (e.g. slides.html) that belong to this community
find "$SRC" -maxdepth 1 -name '*.html' -exec cp {} "$OUT/" \;
DICT=${2:-$SRC/dictionary.js}
if [ -f "$DICT" ]; then cp "$DICT" "$OUT/dictionary.js"
else echo "[WARN] no dictionary: word search will be empty" >&2; echo "window.DICTIONARY = [];" > "$OUT/dictionary.js"; fi
# ranked word suggestions from scripts/build/suggest_words.py, kept beside the private dictionary
PICKS=$(dirname "$DICT")/word_picks_$ID.js
if [ -f "$PICKS" ]; then cp "$PICKS" "$OUT/word_picks.js"; else echo "window.WORD_PICKS = null;" > "$OUT/word_picks.js"; fi
echo "[INFO] assembled $OUT ($(du -sh "$OUT" | cut -f1)); preview: cd $OUT && python3 serve.py 8080 127.0.0.1"
