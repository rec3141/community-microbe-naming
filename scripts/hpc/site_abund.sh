#!/bin/bash
# Abundance (site_abund.py) and read identity of each local sample for one genome on the site,
# from its mapping. Run by genome_site_inputs.sh; run it alone for a genome that only needs
# abundance, e.g. a co-assembly MAG put on the same scale as the stand-alone genomes by mapping
# them all together with remap_genomes.sh.
#   site_abund.sh <label> <out_dir>      (MAPPING_DIR, CONTIG_PREFIX: see site_abund.py)
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=2:00:00
#SBATCH --job-name=site-abund
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
LAB=$1; OUT=$(readlink -m "$2")
python3 "$HELPERS/site_abund.py" "$LAB" "$OUT"
# read identity per local sample (as cand_identity.py: 1 - de, aligned-length weighted), over reads
# at >=90% identity: reads of other species of the genus and beyond, which pile onto a genome
# mapped on its own, would otherwise drag the mean down
python3 - "$LAB" "$OUT" <<'PY'
import collections, csv, json, os, re, subprocess, sys
lab, out = sys.argv[1:3]
P, SIF, BIND = os.environ["PROJECT"], os.environ["MAG_SIF"], os.environ["BIND_DIR"]
samples = [r["flowcell"] + "_" + r["barcode"] for r in csv.DictReader(open(os.environ["LOCAL_META"]), delimiter="\t")
           if r["location"].strip()]
MIN_ALN = int(os.environ.get("MIN_ALN", "0"))
cig = re.compile(r"(\d+)([MI=X])")
res = {}
for s in samples:
    mapd = os.environ.get("MAPPING_DIR") or "%s/assembly_%s/mapping" % (P, lab)
    prefix = os.environ.get("CONTIG_PREFIX", "")
    bam = "%s/%s.sorted.bam" % (mapd, s)
    if not os.path.exists(bam):
        continue
    cmd = ["apptainer", "exec", "-B", BIND, SIF, "bash", "-c",
           "source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly && samtools view -F 0x904 %s" % bam]
    w = aln = n = 0
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)
    for line in p.stdout:
        f = line.split("\t", 11)
        if not f[2].startswith(prefix):
            continue
        de = next((float(t[5:]) for t in f[11].split("\t") if t.startswith("de:f:")), None)
        if de is None:
            continue
        if de > 0.10:
            continue
        if sum(int(x) for x, op in cig.findall(f[5]) if op in "M=X") < MIN_ALN:
            continue  # short hits are usually conserved regions of other microbes' reads
        a = sum(int(x) for x, op in cig.findall(f[5]) if op != "I")
        w += (1 - de) * a; aln += a; n += 1
    p.wait()
    if n:
        res[s] = {lab: {"identity": round(100 * w / aln, 2) if aln else None, "aligned_bp": aln, "reads": n}}
json.dump(res, open(os.path.join(out, "identity.json"), "w"), indent=1)
print("[INFO] identity: %d local samples with reads" % len(res), file=sys.stderr)
PY
