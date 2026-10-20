#!/bin/bash
# Sketch every bin from the Chesterfield-only MAG runs:
#  1. sendsketch against the GTDB r226 BBSketch server on ratnakara (top 3 hits per bin)
#  2. comparesketch against the 12 workshop candidate MAGs (local versions of each microbe)
# Bins under MIN_BP are skipped.
set -euo pipefail
S=${WORK:?export WORK=<folder holding ci_bins/>}
BIN=$S/ci_bins
OUT=$S/ci_sketch
BB=${BBTOOLS:?export BBTOOLS=<BBTools folder>}
CAND=${CANDIDATE_DIR:?export CANDIDATE_DIR=<folder with the candidate MAG fasta files>}
ADDR=${SKETCH_SERVER:?export SKETCH_SERVER=<sendsketch server URL with a GTDB sketch>}
MIN_BP=${MIN_BP:-200000}
mkdir -p "$OUT/gtdb" "$OUT/cand" "$OUT/lists"

# bin list (size-filtered), split into chunks of 150 files
find "$BIN" -mindepth 3 -maxdepth 3 -type f \( -name '*.fa' -o -name '*.fasta' -o -name '*.fna' \) -size +$((MIN_BP / 1024))k | sort > "$OUT/lists/all.txt"
echo "[INFO] $(wc -l < "$OUT/lists/all.txt") bins >= ~$((MIN_BP / 1000)) kbp" >&2
rm -f "$OUT"/lists/chunk_*
split -l 150 -d -a 3 "$OUT/lists/all.txt" "$OUT/lists/chunk_"

# candidate reference sketch (one sketch per candidate MAG)
"$BB/sketch.sh" -Xmx2g in="$(ls "$CAND"/{marine,freshwater}/dastool-*.fa | paste -sd,)" mode=perfile k=32,24 out="$OUT/candidates.sketch" ow 2>/dev/null

one() {
    c=$1; n=$(basename "$c")
    files=$(paste -sd, "$c")
    [ -s "$OUT/gtdb/$n.txt" ] || "$BB/sendsketch.sh" -Xmx3g in="$files" mode=perfile address="$ADDR" k=32,24 \
        format=2 records=3 color=f printtaxa=t out="$OUT/gtdb/$n.txt" 2>"$OUT/gtdb/$n.err"
    [ -s "$OUT/cand/$n.txt" ] || "$BB/comparesketch.sh" -Xmx3g in="$files" mode=perfile ref="$OUT/candidates.sketch" k=32,24 \
        format=3 records=3 minani=0.80 out="$OUT/cand/$n.txt" 2>"$OUT/cand/$n.err"
}
export -f one; export OUT BB ADDR
ls "$OUT"/lists/chunk_* | xargs -P 6 -I{} bash -c 'one {}'
echo "[INFO] done: $(ls "$OUT"/gtdb/*.txt | wc -l) gtdb chunks, $(ls "$OUT"/cand/*.txt | wc -l) candidate chunks" >&2
