#!/bin/bash
# QC of the best Chesterfield-only bin per under-represented lineage (to widen the
# workshop beyond Bacteroidia + Gammaproteobacteria): CheckM2, GTDB-Tk classify_wf (r232),
# barrnap rRNA and tRNAscan-SE, all from the danaSeq mag_analysis container.
#SBATCH --partition=genlm,genoa,genoacpu-b
#SBATCH --cpus-per-task=32
#SBATCH --mem=160G
#SBATCH --time=8:00:00
#SBATCH --job-name=ci-lineage-qc
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
P=$PROJECT
W=$P/ci_lineage_qc
SIF=$MAG_SIF
GTDB=$GTDB_SQSH
CM2DB=$(find -L "$CHECKM2_DB" -name "*.dmnd" | head -1)
ACT="source /opt/conda/etc/profile.d/conda.sh && conda activate"
rm -rf "$W"; mkdir -p "$W/bins" "$W/rna"; cd "$W"
# label  run-suffix  binner  bin
while read -r lab run b bin; do
    cp "$P/mag_chesterfield${run#-}/binning/$b/bins/$bin.fa" "bins/${lab}__${bin}.fa"
done <<'LIST'
Bdellovibrio - metabat metabat_1556
Bacteriovoracia - semibin semibin_006
UBA845 - magscot magscot_008
Armatimonadota - semibin semibin_003
Armatimonadota_fw -_freshwater metabat metabat_524
Amylibacter - metabat metabat_086
Cyanobium - semibin semibin_222
Planctomycetaceae - semibin semibin_008
Planctomycetaceae_fw -_freshwater semibin semibin_005
Spartobacteria - semibin semibin_050
Verrucomicrobiota_fw -_freshwater semibin semibin_035
Pseudothioglobus - lorbin lorbin_025
Acidimicrobiia -_marine lorbin lorbin_118
LIST
echo "[INFO] $(ls bins | wc -l) bins"

echo "[INFO] $(date -Is) CheckM2"
apptainer exec -B "$BIND_DIR" -B "$HOME" "$SIF" bash -c "$ACT /opt/conda/envs/dana-mag-quality
    export TMPDIR=/tmp/checkm2_\$\$; mkdir -p \$TMPDIR
    checkm2 predict --threads 32 --input bins --output-directory checkm2_out -x fa --database_path $CM2DB"

echo "[INFO] $(date -Is) rRNA + tRNA"
apptainer exec -B "$BIND_DIR" "$SIF" bash -c "$ACT /opt/conda/envs/dana-mag-classify
    for f in bins/*.fa; do n=\$(basename \$f .fa)
        barrnap --kingdom bac --threads 16 --quiet \$f > rna/\$n.rrna.gff 2>/dev/null || true
        conda run -p /opt/conda/envs/dana-mag-annotate tRNAscan-SE -B -q --thread 16 -o rna/\$n.trna.txt \$f > /dev/null 2>&1 || true
    done"

echo "[INFO] $(date -Is) GTDB-Tk classify_wf"
apptainer exec -B "$BIND_DIR" -B "$GTDB:/data/dbimg/gtdbtk_db:image-src=/" "$SIF" bash -c "$ACT /opt/conda/envs/dana-mag-gtdbtk
    export GTDBTK_DATA_PATH=/data/dbimg/gtdbtk_db TMPDIR=/tmp/gtdbtk_\$\$; mkdir -p \$TMPDIR
    gtdbtk classify_wf --genome_dir bins --out_dir gtdbtk_out --extension fa --cpus 32 --pplacer_cpus 8 --tmpdir \$TMPDIR
    # marker completeness for genomes the ANI screen classified without placement
    gtdbtk identify --genome_dir bins --out_dir gtdbtk_identify --extension fa --cpus 32"
mkdir -p gtdbtk_out/identify && cp gtdbtk_identify/identify/*markers_summary.tsv gtdbtk_out/identify/ 2>/dev/null || true

python3 $HELPERS/qc_summary.py > summary.tsv
column -t -s $'\t' summary.tsv | cut -c1-250
echo "[INFO] $(date -Is) done"
