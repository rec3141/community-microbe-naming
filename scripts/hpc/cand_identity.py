#!/usr/bin/env python3
"""Read identity of each local sample to each workshop candidate MAG, from the
co-assembly BAMs: primary alignments (-F 0x900) to the MAG's contigs, identity =
1 - minimap2 gap-compressed divergence (de), weighted by aligned query bases.
    cand_identity.py <marine|freshwater> <ci_metadata.tsv> <out.json>
"""
import collections, csv, json, os, re, subprocess, sys

hab, meta_tsv, out = sys.argv[1:4]
P = os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore"))
SIF = os.path.realpath(os.environ.get("MAG_SIF", os.path.expanduser("~/GENICE/danaSeq/mag_analysis/.danaseq-mag-analysis.sif")))
# candidate MAG ids per habitat from the community's build_config.json (env.sh BUILD_CONFIG)
CANDS = json.load(open(os.environ["BUILD_CONFIG"]))["candidates"].get(hab, [])
MARINE_SITES = set(filter(None, os.environ.get("LOCAL_MARINE_SITES", "").split(",")))  # env.sh

samples = []
for r in csv.DictReader(open(meta_tsv), delimiter="\t"):
    loc = r["location"].strip()
    if loc and (loc in MARINE_SITES) == (hab == "marine"):
        samples.append(f"{r['flowcell']}_{r['barcode']}")

c2b, clen = {}, {}
for r in csv.reader(open(f"{P}/mag_{hab}/binning/dastool/contig2bin.tsv"), delimiter="\t"):
    if r[1] in CANDS:
        c2b[r[0]] = r[1]
for r in csv.reader(open(f"{P}/assembly_{hab}/assembly/assembly_info.txt"), delimiter="\t"):
    if r and r[0] in c2b:
        clen[r[0]] = int(r[1])
bed = os.path.abspath(f"cand_contigs_{hab}.bed")
with open(bed, "w") as w:
    for c in c2b:
        w.write(f"{c}\t0\t{clen.get(c, 10**9)}\n")

cig_q = re.compile(r"(\d+)([MI=X])")
res = {}
for s in samples:
    bam = f"{P}/assembly_{hab}/mapping/{s}.sorted.bam"
    if not os.path.exists(bam):
        print(f"[WARN] no BAM for {s}", file=sys.stderr)
        continue
    cmd = ["apptainer", "exec", "-B", os.environ.get("BIND_DIR", os.path.realpath(os.path.expanduser("~/scratch"))), "-B", os.path.expanduser("~"), SIF, "bash", "-c",
           f"source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly && "
           f"samtools view -F 0x900 -M -L {bed} {bam}"]
    acc = collections.defaultdict(lambda: [0.0, 0, 0])  # weighted identity sum, aligned bases, reads
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)
    for line in p.stdout:
        f = line.split("\t", 11)
        b = c2b.get(f[2])
        if not b:
            continue
        de = next((float(t[5:]) for t in f[11].split("\t") if t.startswith("de:f:")), None)
        if de is None:
            continue
        aln = sum(int(n) for n, op in cig_q.findall(f[5]) if op != "I")
        a = acc[b]
        a[0] += (1 - de) * aln
        a[1] += aln
        a[2] += 1
    p.wait()
    res[s] = {b: {"identity": round(100 * v[0] / v[1], 2) if v[1] else None, "aligned_bp": v[1], "reads": v[2]} for b, v in acc.items()}
    print(f"[INFO] {s}: " + ", ".join(f"{b.replace('dastool-', '')}={res[s][b]['identity']}%({res[s][b]['reads']})" for b in res[s]), file=sys.stderr)
json.dump(res, open(out, "w"), indent=1)
