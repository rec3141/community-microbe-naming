#!/bin/bash
#SBATCH --partition=genlm,genoa,genoacpu-b
#SBATCH --cpus-per-task=2
#SBATCH --mem=8G
#SBATCH --time=2:00:00
#SBATCH --job-name=cand-identity
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
# per habitat: identity of local reads to each candidate -> cand_identity_<habitat>.json (copy to inputs_dir/<habitat>/cand_identity.json)
cd "$HELPERS"
for hab in marine freshwater; do
    python3 cand_identity.py $hab "$LOCAL_META" cand_identity_$hab.json &
done
wait
echo "[INFO] $(date -Is) done"
