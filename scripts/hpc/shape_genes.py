#!/usr/bin/env python3
"""Count cell-shape-related genes in each workshop MAG from the co-assembly Bakta annotation."""
import csv, collections, os, re, sys
P = os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore"))
GENES = {  # gene symbol regex -> label
    "mreB": r"^mreB", "mreC": r"^mreC", "mreD": r"^mreD", "rodA/mrdB": r"^(rodA|mrdB)", "pbp2/mrdA": r"^(mrdA|pbpA)$",
    "rodZ": r"^rodZ", "ftsZ": r"^ftsZ", "minCDE": r"^min[CDE]", "creS": r"^creS", "ccmA/bactofilin": r"^(ccmA|bac[A-D])$",
    "csd/pgp": r"^(csd[1-7]|pgp[12])", "flagellin": r"^(fliC|flaA|flaB)", "pilA": r"^pilA", "gliding gld": r"^gld",
}
cands = [l.rstrip("\n").split("\t") for l in open(sys.argv[1])]
for hab in ["marine", "freshwater"]:
    mine = [c for c in cands if c[2] == hab]
    c2b = {}
    for r in csv.reader(open(f"{P}/mag_{hab}/binning/dastool/contig2bin.tsv"), delimiter="\t"):
        c2b[r[0]] = r[1]
    want = {c[1] for c in mine}
    hits = collections.defaultdict(collections.Counter)
    prod = collections.defaultdict(collections.Counter)
    for line in open(f"{P}/mag_{hab}/annotation/bakta/basic/annotation.tsv"):
        if line.startswith("#"): continue
        p = line.rstrip("\n").split("\t")
        b = c2b.get(p[0])
        if b not in want: continue
        gene, product = p[6], p[7]
        for lab, rx in GENES.items():
            if re.search(rx, gene) or (lab == "mreB" and re.search(r"rod shape-determining protein MreB", product, re.I)) \
               or (lab == "creS" and re.search(r"crescentin", product, re.I)) or (lab == "csd/pgp" and re.search(r"cell shape determinant", product, re.I)):
                hits[b][lab] += 1
        if re.search(r"shape", product, re.I):
            prod[b][product] += 1
    for c in mine:
        h = hits[c[1]]
        print(c[0], c[1], c[3], " ".join(f"{k}:{h[k]}" for k in GENES if h[k]), "|", "; ".join(f"{k}({v})" for k, v in prod[c[1]].most_common(5)), sep="\t")
