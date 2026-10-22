#!/usr/bin/env python3
"""abund.json for one genome on the site, from a map_to_ref.sh / remap_genomes.sh mapping:
per sample, from reads at >=95% identity only (cov95.tsv), because a genome mapped without its
relatives also collects their reads: mean depth, breadth = covered fraction, and
  relab        = depth x length as % of all the sample's mapped DNA: CoverM mean depth x length
                 of every read mapped at >=80% identity, summed over every contig of the mapping
                 (mean80.tsv from map_to_ref.sh), the same measure as the numerator
  relab_reads  = the same as % of all the sample's read bases (input_stats.tsv)
    site_abund.py <label> <out_dir>
Mapping: assembly_<label>/mapping by default. When several genomes were mapped together as one
reference (remap_genomes.sh), set MAPPING_DIR to that mapping folder and CONTIG_PREFIX to this
genome's contig prefix there (e.g. "<label>__"); only those contigs are counted.
Python 3.6 compatible (Grex login nodes).
"""
import json, os, sys

label, out = sys.argv[1], sys.argv[2]
P = os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore"))
A = "%s/assembly_%s" % (P, label)
os.makedirs(out, exist_ok=True)
MAPD = os.environ.get("MAPPING_DIR") or "%s/mapping" % A
PREFIX = os.environ.get("CONTIG_PREFIX", "")
stats = {}
for line in open("%s/input_stats.tsv" % MAPD):
    s, n, bp = line.rstrip("\n").split("\t")[:3]
    stats[s] = int(bp)
with open("%s/depths.txt" % MAPD) as f:  # sample names and contig lengths
    hdr = f.readline().rstrip("\n").split("\t")
    names = [h.replace(".sorted.bam", "") for h in hdr if h.endswith(".bam")]
    clen, alllen = {}, {}
    for line in f:
        p = line.split("\t", 2)
        alllen[p[0]] = int(p[1])
        if p[0].startswith(PREFIX):
            clen[p[0]] = int(p[1])
mapped = [0.0] * len(names)  # all mapped DNA: mean depth (>=80% identity) x length, every contig
with open("%s/mean80.tsv" % MAPD) as f:
    h = f.readline().rstrip("\n").split("\t")
    col = {c.replace(".sorted Mean", ""): j for j, c in enumerate(h) if c.endswith(" Mean")}
    idx = [col.get(s) for s in names]
    for line in f:
        p = line.rstrip("\n").split("\t")
        L = alllen.get(p[0], 0)
        for k, j in enumerate(idx):
            if j is not None:
                mapped[k] += float(p[j]) * L
cov, dbp = [0.0] * len(names), [0.0] * len(names)  # >=95% identity: covered bp, depth x bp
with open("%s/cov95.tsv" % MAPD) as f:
    h = f.readline().rstrip("\n").split("\t")
    cf, mn = {}, {}
    for j, col in enumerate(h):
        if col.endswith(" Covered Fraction"):
            cf[col.replace(".sorted Covered Fraction", "")] = j
        elif col.endswith(" Mean"):
            mn[col.replace(".sorted Mean", "")] = j
    for line in f:
        p = line.rstrip("\n").split("\t")
        if p[0] not in clen:
            continue
        L = clen[p[0]]
        for k, s in enumerate(names):
            if s in cf:
                cov[k] += float(p[cf[s]]) * L
                dbp[k] += float(p[mn[s]]) * L
glen = sum(clen.values())
res = {"samples": names, "total_bp_depth": [round(x) for x in mapped], "read_bp": [stats.get(s, 0) for s in names], "mags": {label: {
    "length": glen,
    "relab": [round(100 * dbp[k] / mapped[k], 5) if mapped[k] else 0 for k in range(len(names))],
    "relab_reads": [round(100 * dbp[k] / stats[s], 5) if stats.get(s) else 0 for k, s in enumerate(names)],
    "depth": [round(dbp[k] / glen, 4) if glen else 0 for k in range(len(names))],
    "breadth": [round(cov[k] / glen, 3) if glen else 0 for k in range(len(names))]}}}
json.dump(res, open("%s/abund.json" % out, "w"))
print("[INFO] %s: abundance in %d samples (%.2f Mbp of contigs)" % (label, len(names), glen / 1e6), file=sys.stderr)
