#!/bin/bash
# Map every sample, with all its reads, to several stand-alone genomes at once: one combined
# reference (contigs renamed <label>__<contig>), so the reads are read and mapped only once.
# Afterwards run genome_site_inputs.sh per genome with MAPPING_DIR=<out_dir>/mapping and
# CONTIG_PREFIX=<label>__ to rebuild its abundance and identity.
#   remap_genomes.sh <out_dir> <input_dir[:input_dir...]> <sample_list> <label>=<genome.fa> ...
# MAX_BYTES defaults to 0 here (all reads); PAR and the Slurm size are passed to map_to_ref.sh.
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=64
#SBATCH --mem=128G
#SBATCH --time=24:00:00
#SBATCH --job-name=remap-genomes
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
OUT=$(readlink -m "$1"); IN="$2"; LIST="$3"; shift 3
mkdir -p "$OUT"
REF="$OUT/combined.fasta"
if [ ! -s "$REF" ]; then
    for kv in "$@"; do
        lab=${kv%%=*}; fa=${kv#*=}
        awk -v p="${lab}__" '/^>/{ sub(/^>/, ">" p); print $1; next } { print }' "$fa"
    done > "$REF.tmp" && mv "$REF.tmp" "$REF"
fi
echo "[INFO] $(date -Is) $(grep -c '>' "$REF") contigs from $# genomes in $REF"
MAX_BYTES=${MAX_BYTES:-0} bash "$HELPERS/map_to_ref.sh" "$REF" "$IN" "$LIST" "$OUT"
