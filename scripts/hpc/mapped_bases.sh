#!/bin/bash
# Bases mapped per sample in a mapping folder's BAMs: the denominator for "% of all mapped reads".
# Writes <mapping_dir>/mapped_bases.tsv (sample, alignments counted, aligned bases).
# MIN_ALN (default 0): leave out alignments with fewer aligned bases (M/=/X), as for the
# genomes' own depths (map_to_ref.sh, site_abund.sh). 0 = samtools stats "bases mapped (cigar)".
#   mapped_bases.sh <mapping_dir> [<mapping_dir> ...]
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=48
#SBATCH --mem=48G
#SBATCH --time=12:00:00
#SBATCH --job-name=mapped-bases
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
export MIN_ALN=${MIN_ALN:-0}
for d in "$@"; do
    d=$(readlink -f "$d")
    ls "$d"/*.sorted.bam | xargs -P ${SLURM_CPUS_PER_TASK:-8} -I{} apptainer exec -B "$BIND_DIR" -B "$d" "$NANO_SIF" bash -c '
        source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly
        b={}; s=$(basename $b .sorted.bam)
        if [ "$MIN_ALN" -gt 0 ]; then
            samtools view -F 0x904 $b | awk -F"\t" -v s=$s -v min=$MIN_ALN "
                { c=\$6; a=0; while (match(c, /[0-9]+[MIDNSHP=X]/)) { n=substr(c, RSTART, RLENGTH-1); op=substr(c, RSTART+RLENGTH-1, 1);
                  if (op==\"M\" || op==\"=\" || op==\"X\") a+=n; c=substr(c, RSTART+RLENGTH) }
                  if (a >= min) { r++; m+=a } }
                END { print s\"\t\"r+0\"\t\"m+0 }"
        else
            samtools stats $b | awk -F"\t" -v s=$s "/^SN\treads mapped:/{r=\$3} /^SN\tbases mapped \\(cigar\\):/{m=\$3} END{print s\"\t\"r\"\t\"m}"
        fi' \
        | sort > "$d/mapped_bases.tsv"
    echo "[INFO] $(date -Is) $d: $(wc -l < "$d/mapped_bases.tsv") samples (MIN_ALN=$MIN_ALN)"
done
