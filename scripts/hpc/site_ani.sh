#!/bin/bash
# ANI of every site genome against all GTDB species representatives, with skani and the sketch
# database that ships with the GTDB-Tk reference data. Writes <out_dir>/skani.tsv (build_config
# `ani_table`) and copies the release's gtdb_taxonomy.tsv (`gtdb_taxonomy`). skani reports
# matches above about 80% ANI; a genome with no row has no close relative in GTDB.
#   site_ani.sh <out_dir> <genome.fa> [genome.fa ...]
# File names (without .fa) must be the ids the site uses (MAG ids or extra_genomes labels).
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=16
#SBATCH --mem=64G
#SBATCH --time=2:00:00
#SBATCH --job-name=site-ani
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
OUT=$(readlink -m "${1:?usage: site_ani.sh <out_dir> <genome.fa> ...}"); shift
mkdir -p "$OUT/fa"
for f in "$@"; do ln -sf "$(readlink -f "$f")" "$OUT/fa/$(basename "$f")"; done  # keep the given name
apptainer exec -B "$BIND_DIR" -B "$OUT" -B "$GTDB_SQSH:/data/dbimg/gtdbtk_db:image-src=/" "$MAG_SIF" bash -c "source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-gtdbtk
    cd '$OUT' && skani search -d /data/dbimg/gtdbtk_db/skani/database -t \${SLURM_CPUS_PER_TASK:-16} -n 60 fa/*.fa -o skani.tsv
    cp /data/dbimg/gtdbtk_db/taxonomy/gtdb_taxonomy.tsv gtdb_taxonomy.tsv"
echo "[INFO] $(( $(wc -l < "$OUT/skani.tsv") - 1 )) hits for $# genomes in $OUT/skani.tsv"
