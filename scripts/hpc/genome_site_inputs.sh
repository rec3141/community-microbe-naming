#!/bin/bash
# Site inputs for one stand-alone genome (after genome_to_site.sh + danaSeq mag_analysis):
# genome_site_inputs.py, then ecosystem services (ecossdb aggregate_bins.py with every contig
# in one bin) and read identity of each local sample (from the genome's BAMs), both in the
# danaSeq mag_analysis container.
#   genome_site_inputs.sh <label> <checkm2_completeness> <checkm2_contamination> <out_dir>
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
# read identity per local sample (as cand_identity.py: 1 - de, aligned-length weighted), over reads
# at >=90% identity: reads of other species of the genus and beyond, which pile onto a genome
# mapped on its own, would otherwise drag the mean down
python3 - "$LAB" "$OUT" <<'PY'
import collections, csv, json, os, re, subprocess, sys
lab, out = sys.argv[1:3]
P, SIF, BIND = os.environ["PROJECT"], os.environ["MAG_SIF"], os.environ["BIND_DIR"]
samples = [r["flowcell"] + "_" + r["barcode"] for r in csv.DictReader(open(os.environ["LOCAL_META"]), delimiter="\t")
           if r["location"].strip()]
cig = re.compile(r"(\d+)([MI=X])")
res = {}
for s in samples:
    bam = "%s/assembly_%s/mapping/%s.sorted.bam" % (P, lab, s)
    if not os.path.exists(bam):
        continue
    cmd = ["apptainer", "exec", "-B", BIND, SIF, "bash", "-c",
           "source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly && samtools view -F 0x904 %s" % bam]
    w = aln = n = 0
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)
    for line in p.stdout:
        f = line.split("\t", 11)
        de = next((float(t[5:]) for t in f[11].split("\t") if t.startswith("de:f:")), None)
        if de is None:
            continue
        if de > 0.10:
            continue
        a = sum(int(x) for x, op in cig.findall(f[5]) if op != "I")
        w += (1 - de) * a; aln += a; n += 1
    p.wait()
    if n:
        res[s] = {lab: {"identity": round(100 * w / aln, 2) if aln else None, "aligned_bp": aln, "reads": n}}
json.dump(res, open(os.path.join(out, "identity.json"), "w"), indent=1)
print("[INFO] identity: %d local samples with reads" % len(res), file=sys.stderr)
PY
ls -la "$OUT"
