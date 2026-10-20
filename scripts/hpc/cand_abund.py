#!/usr/bin/env python3
"""Per-sample relative abundance of the workshop candidate MAGs from a jgi depth table.

  relab  = sum(depth x length) over the MAG contigs / sum(depth x length) over all contigs
           (the MAG share of the sample DNA that mapped to the co-assembly, %)
  depth  = length-weighted mean depth of the MAG contigs (x)
  breadth= length fraction of the MAG contigs with any reads (0-1)
    cand_abund.py <habitat> <depths.txt> <out.json>
"""
import csv, json, os, sys
hab, depths, out = sys.argv[1:4]
R = os.path.join(os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore")), f"mag_{hab}")
# candidate MAG ids per habitat from the community's build_config.json (env.sh BUILD_CONFIG)
CANDS = json.load(open(os.environ["BUILD_CONFIG"]))["candidates"].get(hab, [])
c2b = {}
for r in csv.reader(open(f"{R}/binning/dastool/contig2bin.tsv"), delimiter="\t"):
    if r[1] in CANDS:
        c2b[r[0]] = r[1]
with open(depths) as f:
    hdr = f.readline().rstrip("\n").split("\t")
    idx = [i for i, h in enumerate(hdr) if h.endswith(".bam")]
    names = [hdr[i].replace(".sorted.bam", "") for i in idx]
    n = len(idx)
    total = [0.0] * n
    bp = {c: [0.0] * n for c in CANDS}
    cov = {c: [0.0] * n for c in CANDS}
    clen = {c: 0 for c in CANDS}
    for line in f:
        p = line.split("\t")
        L = int(p[1]); b = c2b.get(p[0])
        if b: clen[b] += L
        for k, i in enumerate(idx):
            v = float(p[i])
            if v:
                x = v * L
                total[k] += x
                if b:
                    bp[b][k] += x
                    cov[b][k] += L
res = {"samples": names, "total_bp_depth": [round(t) for t in total], "mags": {}}
for c in CANDS:
    res["mags"][c] = {
        "length": clen[c],
        "relab": [round(100 * bp[c][k] / total[k], 5) if total[k] else 0 for k in range(n)],
        "depth": [round(bp[c][k] / clen[c], 4) if clen[c] else 0 for k in range(n)],
        "breadth": [round(cov[c][k] / clen[c], 3) if clen[c] else 0 for k in range(n)],
    }
json.dump(res, open(out, "w"))
print(f"[INFO] {hab}: {n} samples, contigs assigned: {len(c2b)}", file=sys.stderr)
