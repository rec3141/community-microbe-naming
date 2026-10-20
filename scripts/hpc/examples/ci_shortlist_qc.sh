#!/bin/bash
# QC for Chesterfield-only shortlist bins (sketch picks + Chesterfield-specific SUP05/Oceaniferula):
# CheckM2, GTDB-Tk classify_wf (r232), barrnap rRNA, tRNAscan-SE tRNA amino acids.
#SBATCH --partition=genlm,genoa,genoacpu-b
#SBATCH --cpus-per-task=32
#SBATCH --mem=160G
#SBATCH --time=8:00:00
#SBATCH --job-name=ci-shortlist-qc
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
P=$PROJECT
W=$P/ci_shortlist_qc
SIF=$MAG_SIF
GTDB=$GTDB_SQSH
CM2DB=$(find -L "$CHECKM2_DB" -name "*.dmnd" | head -1)
rm -rf "$W"; mkdir -p "$W/bins"; cd "$W"
# label  run  binner  bin
while read lab run b bin; do
  r=${run/__COMB__/}; cp "$P/mag_chesterfield${r}/binning/$b/bins/$bin.fa" "bins/${lab}__${bin}.fa"
done <<LIST
A1 _freshwater vamb vamb_176
A2 _freshwater semibin semibin_003
A3 _freshwater vamb vamb_016
B _freshwater lorbin lorbin_017
C _marine metabat metabat_555
D _marine lorbin lorbin_002
E _marine lorbin lorbin_004
F _marine semibin semibin_017
G _freshwater lorbin lorbin_005
H _freshwater vamb vamb_022
I _freshwater vamb vamb_010
J _freshwater metabat metabat_610
K1 __COMB__ metabat metabat_359
K2 _marine semibin semibin_018
L1 __COMB__ semibin semibin_072
L2 _marine semibin semibin_065
LIST
ls bins | wc -l

echo "[INFO] $(date -Is) CheckM2"
apptainer exec -B "$BIND_DIR" -B "$HOME" "$SIF" bash -euc "
export TMPDIR=/tmp/checkm2_\$\$; mkdir -p \$TMPDIR
/opt/conda/envs/dana-mag-quality/bin/checkm2 predict --threads 32 --input bins --output-directory checkm2_out -x fa --database_path $CM2DB"

echo "[INFO] $(date -Is) barrnap + tRNAscan-SE"
mkdir -p rna
apptainer exec -B "$BIND_DIR" "$SIF" bash -euc "
for f in bins/*.fa; do n=\$(basename \$f .fa)
  /opt/conda/envs/dana-mag-classify/bin/barrnap --kingdom bac --threads 8 --quiet \$f > rna/\$n.rrna.gff 2>/dev/null || true
  /opt/conda/envs/dana-mag-annotate/bin/tRNAscan-SE -B -q --thread 8 -o rna/\$n.trna.txt \$f >/dev/null 2>&1 || true
done"

echo "[INFO] $(date -Is) GTDB-Tk classify_wf"
apptainer exec -B "$BIND_DIR" -B "$GTDB:/data/dbimg/gtdbtk_db:image-src=/" "$SIF" bash -euc "
export PATH=/opt/conda/envs/dana-mag-gtdbtk/bin:\$PATH GTDBTK_DATA_PATH=/data/dbimg/gtdbtk_db TMPDIR=/tmp/gtdbtk_\$\$; mkdir -p \$TMPDIR
gtdbtk classify_wf --genome_dir bins --out_dir gtdbtk_out --extension fa --cpus 32 --pplacer_cpus 8 --tmpdir \$TMPDIR"

python3 -I - > summary.tsv <<"PY"
import csv, glob, os, re
AA = set("Ala Arg Asn Asp Cys Gln Glu Gly His Ile Leu Lys Met Phe Pro Ser Thr Trp Tyr Val".split())
cm = {r["Name"]: r for r in csv.DictReader(open("checkm2_out/quality_report.tsv"), delimiter="\t")}
g = {}
for dom, tot in [("bac120", 120), ("ar53", 53)]:
    for f in glob.glob(f"gtdbtk_out/identify/gtdbtk.{dom}.markers_summary.tsv"):
        for r in csv.DictReader(open(f), delimiter="\t"):
            u, m = int(r["number_unique_genes"]), int(r["number_multiple_genes"])
            if r["name"] not in g or u > g[r["name"]][0]: g[r["name"]] = (u, m, tot)
tax = {}
for f in glob.glob("gtdbtk_out/gtdbtk.*.summary.tsv"):
    for r in csv.DictReader(open(f), delimiter="\t"):
        tax[r["user_genome"]] = (r["classification"], r.get("closest_genome_ani", ""), r.get("classification_method", ""))
print("bin\tgtdb_comp\tgtdb_cont\tcheckm2_comp\tcheckm2_cont\tMbp\tcontigs\t16S\t23S\t5S\ttRNA_aa\tmissing_aa\tclosest_ANI\tmethod\tclassification")
for n in sorted(cm):
    u, m, tot = g.get(n, (0, 0, 120))
    rr = {"16S": 0, "23S": 0, "5S": 0}
    p = f"rna/{n}.rrna.gff"
    if os.path.exists(p):
        for line in open(p):
            mm = re.search(r"Name=(\d+S)_rRNA", line)
            if mm and "partial" not in line: rr[mm.group(1)] = rr.get(mm.group(1), 0) + 1
    aa = set()
    p = f"rna/{n}.trna.txt"
    if os.path.exists(p):
        for line in open(p):
            f = line.split("\t")
            if len(f) > 4 and f[4].strip() in AA: aa.add(f[4].strip())
    t = tax.get(n, ("", "", ""))
    print(f"{n}\t{u/tot*100:.1f}\t{m/tot*100:.1f}\t{cm[n][Completeness]}\t{cm[n][Contamination]}\t{int(cm[n][Genome_Size])/1e6:.2f}\t{cm[n][Total_Contigs]}\t{rr[16S]}\t{rr[23S]}\t{rr[5S]}\t{len(aa)}\t{,.join(sorted(AA-aa))}\t{t[1]}\t{t[2][:25]}\t{t[0]}")
PY
column -t -s $'\t' summary.tsv | cut -c1-250
echo "[INFO] $(date -Is) done"
