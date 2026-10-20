#!/bin/bash
#SBATCH --partition=genlm,genoa,genoacpu-b
#SBATCH --cpus-per-task=2
#SBATCH --mem=16G
#SBATCH --time=2:00:00
#SBATCH --job-name=cand-abund
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
# per habitat: depth table of the co-assembly mapping -> cand_abund_<habitat>.json (copy to inputs_dir/<habitat>/cand_abund.json)
cd "$HELPERS"
for hab in marine freshwater; do
    python3 cand_abund.py $hab "$PROJECT/assembly_$hab/mapping/depths.txt" cand_abund_$hab.json &
done
wait
echo "[INFO] $(date -Is) done"
