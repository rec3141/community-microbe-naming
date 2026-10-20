#!/bin/bash
# Prepare one genome (e.g. a reassembly) for mag_analysis without running an assembler:
# copy it into <out>/assembly/assembly.fasta, compute tnf.tsv and gc.tsv the way danaSeq
# CALCULATE_TNF does (tetramer_freqs from the nanopore_assembly container), then map the
# samples to it with map_to_ref.sh (same args as that script after the first two).
#   genome_to_site.sh <genome.fasta> <out_dir> <input_dir[:input_dir...]> <sample_list>
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=64
#SBATCH --mem=128G
#SBATCH --time=6:00:00
#SBATCH --job-name=genome-to-site
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
FA=$(readlink -f "$1"); OUT=$(readlink -m "$2"); IN="$3"; LIST="$4"
SIF=$NANO_SIF
mkdir -p "$OUT/assembly"
cp "$FA" "$OUT/assembly/assembly.fasta"
apptainer exec -B "$BIND_DIR" -B "$OUT" "$SIF" \
    /pipeline/bin/tetramer_freqs -f "$OUT/assembly/assembly.fasta" -min 0 -max 999999999 -o "$OUT/assembly/tnf.tsv"
[ -s "$OUT/assembly/tnf.tsv" ] || { echo "[ERROR] empty tnf.tsv" >&2; exit 1; }
python3 - "$OUT/assembly/assembly.fasta" "$OUT/assembly/gc.tsv" <<'PY'
import sys
seqs, name = {}, None
for line in open(sys.argv[1]):
    if line.startswith(">"):
        name = line[1:].split()[0]; seqs[name] = []
    else:
        seqs[name].append(line.strip().upper())
with open(sys.argv[2], "w") as w:
    w.write("contig_id\tgc_pct\n")
    for n, parts in seqs.items():
        s = "".join(parts); acgt = sum(s.count(b) for b in "ACGT")
        w.write(f"{n}\t{100 * (s.count('G') + s.count('C')) / max(1, acgt):.2f}\n")
PY
echo "[INFO] $(date -Is) $(grep -c '>' "$OUT/assembly/assembly.fasta") contigs prepared in $OUT"
bash $HELPERS/map_to_ref.sh "$OUT/assembly/assembly.fasta" "$IN" "$LIST" "$OUT"
