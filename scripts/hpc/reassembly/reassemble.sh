#!/bin/bash
# Per-genome reassembly with Flye from reads already mapped to each bin's contigs.
# One array task per line of genomes.tsv (label, bin fasta, BAM dir, sample list or ALL,
# and optionally the assembly the BAMs were mapped to, when it isn't the bin's own assembly):
#   1. pull primary alignments to the bin's contigs (-F 0x900) from the chosen BAMs, keeping
#      reads at >=96% identity without long mid-contig clips (filter_reads.awk) -> FASTQ
#   2. flye --meta --nano-hq (same read type and mode as the danaSeq assembly), then drop
#      contigs below 30% of the length-weighted median coverage (strain variants, contaminants)
#   3. QC the original bin and the reassembly side by side: CheckM2, GTDB-Tk identify
#      markers, barrnap rRNA, tRNAscan-SE amino acids, skani ANI/AF to the original
#   sbatch --array=1-4 reassemble.sh      # rows of genomes.tsv
#SBATCH --partition=genlm,genoa,genoacpu-b
#SBATCH --cpus-per-task=16
#SBATCH --mem=64G
#SBATCH --time=8:00:00
#SBATCH --job-name=reassemble
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
P=$PROJECT
R=$P/reassembly
SIF=$MAG_SIF
GTDB=$GTDB_SQSH
CM2DB=$(find -L "$CHECKM2_DB" -name "*.dmnd" | head -1)
T=${SLURM_CPUS_PER_TASK:-16}

IFS=$'\t' read -r label fasta bamdir samples refasm < <(sed -n "${SLURM_ARRAY_TASK_ID}p" "$R/genomes.tsv")
O=$R/$label
echo "[INFO] $(date -Is) $label"
rm -rf "$O"; mkdir -p "$O/qc"; cd "$O"
cp "$fasta" qc/original.fa

# contigs of the bin as a BED of full lengths
awk '/^>/{if(n)print n"\t0\t"l; n=substr($1,2); l=0; next}{l+=length($0)}END{print n"\t0\t"l}' qc/original.fa > contigs.bed
gsize=$(awk '{s+=$3}END{print s}' contigs.bed)

# BAMs mapped to another assembly: find its contigs that match the bin at >= 96% identity
# over >= 80% of their length (bin indexed, the large assembly streamed through as query),
# and pull reads from those. A looser rule lets short conserved hits pull in whole
# unrelated contigs and the "genome" becomes a metagenome.
if [ -n "${refasm:-}" ]; then
    echo "[INFO] $(date -Is) matching $(basename "$refasm") contigs to the bin"
    apptainer exec -B "$BIND_DIR" -B "$HOME" "$SIF" bash -c \
        "source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly && minimap2 -x asm5 -t $T qc/original.fa $refasm" > to_ref.paf 2> to_ref.log
    python3 - <<'PY'
import collections
aln, qlen = collections.Counter(), {}
for line in open("to_ref.paf"):
    f = line.split("\t")
    if int(f[10]) and int(f[9]) / int(f[10]) >= 0.96:
        aln[f[0]] += int(f[3]) - int(f[2])
        qlen[f[0]] = int(f[1])
keep = [q for q in aln if qlen[q] >= 2000 and aln[q] >= 0.8 * qlen[q]]
with open("contigs.bed", "w") as w:
    for q in keep:
        w.write(f"{q}\t0\t{qlen[q]}\n")
print(f"[INFO] {len(keep)} matching contigs, {sum(qlen[q] for q in keep)} bp")
PY
fi

# BAMs to read from
if [ "$samples" = "ALL" ]; then
    ls "$bamdir"/*.sorted.bam > bams.txt
else
    while read -r s; do [ -s "$bamdir/$s.sorted.bam" ] && echo "$bamdir/$s.sorted.bam"; done < "$samples" > bams.txt
fi
echo "[INFO] $(wc -l < bams.txt) BAMs, $(wc -l < contigs.bed) contigs, $gsize bp"

apptainer exec -B "$BIND_DIR" "$SIF" bash -euc "
source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly
S=samtools
> reads.fastq
while read -r b; do
    echo \"[INFO] \$(basename \$b .sorted.bam)\" >&2
    \$S view -F 0x900 -M -L contigs.bed \"\$b\" | awk -v MAXDE=${MAXDE:-0.04} -f $R/filter_reads.awk contigs.bed - >> reads.fastq
done < bams.txt 2> recruit.log
"
grep -c "kept" recruit.log >/dev/null && awk '/reads kept/{k+=$4; i+=$8; c+=$13}END{printf "[INFO] recruitment: kept %d reads, dropped %d below identity, %d with mid-contig clips\n", k, i, c}' recruit.log
read nreads nbases < <(awk 'NR%4==2{n++; b+=length($0)}END{print n+0, b+0}' reads.fastq)
cov=$(awk -v b="$nbases" -v g="$gsize" 'BEGIN{printf "%.1f", b/g}')
echo "[INFO] $nreads reads, $nbases bp, ~${cov}x of the original bin"
gzip -f reads.fastq

if awk -v c="$cov" 'BEGIN{exit !(c >= 3)}'; then
    echo "[INFO] $(date -Is) flye"
    apptainer exec -B "$BIND_DIR" "$SIF" bash -c \
        "source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly && flye --nano-hq reads.fastq.gz --meta -t $T -o flye" > flye.log 2>&1 || echo "[WARN] flye failed (see flye.log)"
    if [ -s flye/assembly.fasta ]; then
        cp flye/assembly.fasta qc/reassembly_raw.fa
        # keep contigs with >=30% of the length-weighted median coverage
        python3 - <<'PY'
rows = [l.split("\t") for l in open("flye/assembly_info.txt") if not l.startswith("#")]
rows = [(r[0], int(r[1]), float(r[2])) for r in rows]
tot, acc, med = sum(r[1] for r in rows), 0, 0
for name, ln, cv in sorted(rows, key=lambda r: r[2]):
    acc += ln
    if acc >= tot / 2:
        med = cv; break
keep = {r[0] for r in rows if r[2] >= 0.3 * med}
out, w = open("qc/reassembly.fa", "w"), False
for line in open("flye/assembly.fasta"):
    if line.startswith(">"):
        w = line[1:].split()[0] in keep
    if w:
        out.write(line)
print(f"[INFO] flye: {len(rows)} contigs, median coverage {med:.1f}x; kept {len(keep)} at >= {0.3*med:.1f}x")
PY
    fi
else
    echo "[WARN] coverage ${cov}x is too low to assemble; QC of the original bin only"
fi

echo "[INFO] $(date -Is) QC"
apptainer exec -B "$BIND_DIR" -B "$HOME" "$SIF" bash -euc "
export TMPDIR=/tmp/checkm2_\$\$; mkdir -p \$TMPDIR
source /opt/conda/etc/profile.d/conda.sh
conda activate /opt/conda/envs/dana-mag-quality
checkm2 predict --threads $T --input qc --output-directory checkm2_out -x fa --database_path $CM2DB > checkm2.log 2>&1
conda activate /opt/conda/envs/dana-mag-classify
mkdir -p rna
for f in qc/*.fa; do n=\$(basename \$f .fa)
    barrnap --kingdom bac --threads $T --quiet \$f > rna/\$n.rrna.gff 2>/dev/null || true
    conda run -p /opt/conda/envs/dana-mag-annotate tRNAscan-SE -B -q --thread $T -o rna/\$n.trna.txt \$f > /dev/null 2>&1 || true
done
if [ -s qc/reassembly.fa ]; then
    conda activate /opt/conda/envs/dana-mag-assembly
    skani dist qc/reassembly.fa qc/original.fa -o skani.tsv 2>/dev/null || true
fi"
apptainer exec -B "$BIND_DIR" -B "$GTDB:/data/dbimg/gtdbtk_db:image-src=/" "$SIF" bash -euc "
source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-gtdbtk
export GTDBTK_DATA_PATH=/data/dbimg/gtdbtk_db
gtdbtk identify --genome_dir qc --out_dir gtdbtk_out --extension fa --cpus $T > gtdbtk.log 2>&1"

# side-by-side summary (same columns as ci_shortlist_qc, plus read recruitment and skani)
python3 $HELPERS/qc_summary.py | sed "s/^/${label}\t${nreads}\t${cov}\t/" > summary.tsv
if [ -s skani.tsv ]; then
    awk -F'\t' 'NR==2{printf "[INFO] reassembly vs original: ANI %s, AF ref %s, AF query %s\n", $3, $4, $5}' skani.tsv
fi
cut -f1,4- summary.tsv
echo "[INFO] $(date -Is) done"
