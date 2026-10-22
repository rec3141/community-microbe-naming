#!/bin/bash
# Site inputs for one stand-alone genome (after genome_to_site.sh + danaSeq mag_analysis):
# genome_site_inputs.py, then ecosystem services (ecossdb aggregate_bins.py with every contig
# in one bin, in the danaSeq mag_analysis container), then abundance and read identity per
# sample (site_abund.sh).
#   genome_site_inputs.sh <label> <checkm2_completeness> <checkm2_contamination> <out_dir>
# MAPPING_DIR / CONTIG_PREFIX: use a shared mapping of several genomes (see site_abund.py)
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=2:00:00
#SBATCH --job-name=genome-site-inputs
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
LAB=$1; OUT=$(readlink -m "$4")
python3 "$HELPERS/genome_site_inputs.py" "$@"
apptainer exec -B "$BIND_DIR" -B "$OUT" "$MAG_SIF" bash -c "source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-classify
    python3 /pipeline/ecossdb/bin/aggregate_bins.py --catalog '$OUT/es_catalog.tsv' --contig2bin '$OUT/contig2bin.tsv' --output '$OUT/es_per_mag.tsv'"
bash "$HELPERS/site_abund.sh" "$LAB" "$OUT"
ls -la "$OUT"
