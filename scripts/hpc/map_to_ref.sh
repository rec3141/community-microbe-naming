#!/bin/bash
# Map nanopore samples to a reference (one genome or a set of genomes) straight from the
# danaSeq nanopore_assembly container: no Nextflow, no read pooling, no re-compression.
#   map_to_ref.sh <ref.fasta> <input_dir> <sample_list> <out_dir>
# input_dir   : run folders laid out <run>/fastq_pass/barcodeNN/*.fastq.gz (as input_freshwater);
#               several folders can be given separated by ':'
# sample_list : sample IDs FLOWCELL_barcodeNN, one per line (flowcell = 4th '_' field of the
#               run name, as danaSeq names them; a flowcell in several runs is merged)
# out_dir     : gets mapping/<sample>.sorted.bam(.bai) and mapping/depths.txt, using the same
#               minimap2/samtools/CoverM settings as danaSeq MAP_READS / CALCULATE_DEPTHS, plus
#               mapping/input_stats.tsv (reads and bases mapped per sample) and mapping/cov95.tsv
#               (mean depth and covered fraction from reads at >=95% identity, i.e. the same
#               species rather than relatives forced onto the reference), and mapping/mean80.tsv
#               (mean depth of every read mapped at >=80%: the denominator of site_abund.py)
# MIN_ALN     : alignments shorter than this many bases are left out of cov95.tsv and mean80.tsv
#               (default 0); 500 drops the short conserved-region hits of other microbes' reads
# MAX_BYTES   : cap on read bases per sample, cut at a whole read (default 100 Mbp; 0 = all reads).
#               A cap keeps relative abundance but lowers depth and breadth, so use 0 when
#               'detected' (breadth) matters.
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=64
#SBATCH --mem=128G
#SBATCH --time=12:00:00
#SBATCH --job-name=map-to-ref
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
REF=$(readlink -f "$1"); IN="$2"; LIST=$(readlink -f "$3"); OUT=$(readlink -f "$4")
PAR=${PAR:-8}; TH=$(( ${SLURM_CPUS_PER_TASK:-64} / PAR )); MAX_BYTES=${MAX_BYTES:-100000000}; MIN_ALN=${MIN_ALN:-0}
SIF=$NANO_SIF
mkdir -p "$OUT/mapping/stats"
echo "[INFO] $(date -Is) ref=$REF samples=$(wc -l < "$LIST") parallel=$PAR x ${TH} threads"

# sample -> its barcode folders (all runs of that flowcell)
MAP="$OUT/mapping/sample_dirs.tsv"
for base in ${IN//:/ }; do for d in "$(readlink -f "$base")"/*/fastq_pass/barcode*; do
    run=$(basename "$(dirname "$(dirname "$d")")")
    fc=$(echo "$run" | cut -d_ -f4)
    printf '%s_%s\t%s\n' "$fc" "$(basename "$d")" "$d"
done; done > "$MAP"

map_one() {
    s=$1
    bam="$OUT/mapping/$s.sorted.bam"
    [ -s "$bam.bai" ] && return 0
    dirs=$(awk -F'\t' -v s="$s" '$1==s{print $2}' "$MAP" | tr '\n' ' ')
    [ -z "$dirs" ] && { echo "[WARN] $s: no barcode folder" >&2; return 0; }
    apptainer exec -B "$BIND_DIR" -B "$OUT" -B "$(dirname "$REF")" "$SIF" bash -c "
        source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly
        set -o pipefail
        for d in $dirs; do for f in \"\$d\"/*.fastq.gz; do
            gzip -dc \"\$f\" 2>/dev/null; rc=\$?
            [ \$rc -eq 141 ] && break 2   # read cap reached downstream: stop quietly
            if [ \$rc -ne 0 ]; then echo \"[WARN] $s: unreadable \$f\" >&2; fi
        done; done \
        | awk -v max=$MAX_BYTES -v s=$s -v st='$OUT/mapping/stats/$s.tsv' '
            { print }
            NR % 4 == 2 { n++; bp += length(\$0) }
            NR % 4 == 0 && max > 0 && bp >= max { exit }
            END { printf \"%s\\t%d\\t%d\\n\", s, n, bp > st }' \
        | minimap2 -a -x map-ont --secondary=no -t $TH '$REF' - 2>/dev/null \
        | samtools view -b -F 0x104 - \
        | samtools sort -@ 2 -m 1G -o '$bam.tmp' - \
        && mv '$bam.tmp' '$bam' && samtools index '$bam'" \
        && echo "[INFO] $(date +%T) $s done" || echo "[WARN] $s failed" >&2
}
export -f map_one; export OUT MAP REF SIF TH IN MAX_BYTES
xargs -a "$LIST" -P "$PAR" -I{} bash -c 'map_one {}'

echo "[INFO] $(date -Is) depths"
apptainer exec -B "$BIND_DIR" -B "$OUT" "$SIF" bash -c "
    source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly
    set -o pipefail; cd '$OUT/mapping'
    coverm contig -b *.sorted.bam --methods metabat --min-read-percent-identity 80 \
        --min-read-aligned-percent 0 --threads ${SLURM_CPUS_PER_TASK:-64} 2> coverm.log | cat > depths.txt
    coverm contig -b *.sorted.bam --methods mean covered_fraction --min-read-percent-identity 95 \
        --min-read-aligned-percent 0 --min-read-aligned-length $MIN_ALN --threads ${SLURM_CPUS_PER_TASK:-64} 2>> coverm.log | cat > cov95.tsv
    coverm contig -b *.sorted.bam --methods mean --min-read-percent-identity 80 \
        --min-read-aligned-percent 0 --min-read-aligned-length $MIN_ALN --threads ${SLURM_CPUS_PER_TASK:-64} 2>> coverm.log | cat > mean80.tsv"
cat "$OUT"/mapping/stats/*.tsv > "$OUT/mapping/input_stats.tsv"
echo "[INFO] $(date -Is) done: $(ls "$OUT"/mapping/*.sorted.bam | wc -l) BAMs, depths.txt $(head -1 "$OUT/mapping/depths.txt" | tr '\t' '\n' | grep -c 'bam$') samples"
