#!/usr/bin/env python3
"""Combine GTDB sendsketch and candidate comparesketch results for the Chesterfield-only bins
into one table (ci_sketch/ci_bins_sketch.tsv); print local matches to the 12 candidates."""
import collections, glob, os, re, sys
S = sys.argv[1]; O = f"{S}/ci_sketch"
CAND = {"dastool-lorbin_055": 1, "dastool-lorbin_162": 2, "dastool-metabat_11223": 3, "dastool-semibin_075": 4, "dastool-lorbin_002": 5,
        "dastool-lorbin_051": 6, "dastool-comebin_6520": 7, "dastool-comebin_832": 8, "dastool-comebin_4228": 9, "dastool-lorbin_069": 10,
        "dastool-comebin_3630": 11, "dastool-lorbin_054": 12}
RUN = {"mag_chesterfield": "combined", "mag_chesterfield_freshwater": "fresh", "mag_chesterfield_marine": "marine"}

def lin(t):
    d = dict(x.split(":", 1) for x in t.split(";") if ":" in x)
    return ";".join(f"{r}__{d.get(r, '')}" for r in "dpcofgs")

rows = {}
for lst in sorted(glob.glob(f"{O}/lists/chunk_*")):
    n = os.path.basename(lst)
    paths = {os.path.basename(p.strip()): p.strip() for p in open(lst)}
    def key(b):
        p = paths[b]; parts = p.split("/")
        return (RUN[parts[-3]], parts[-2], b[:-3])
    cur = None; k = 0
    for line in open(f"{O}/gtdb/{n}.txt"):
        if line.startswith("Query:"):
            f = dict(x.split(": ", 1) for x in line.rstrip("\n").split("\t") if ": " in x)
            cur = key(os.path.basename(f["File"].strip()))
            rows[cur] = dict(bp=int(f["Bases"]), seqs=int(f["Seqs"].strip()), gc=float(f["GC"]), hits=[], cand=[])
            k = 0
        elif cur and re.match(r"^[\d.]+%\t", line):
            p = line.rstrip("\n").split("\t")
            rows[cur]["hits"].append(dict(wkid=float(p[0][:-1]), ani=float(p[2][:-1]), complt=float(p[4][:-1]), contam=float(p[5][:-1]), name=p[11], lin=lin(p[12])))
    for line in open(f"{O}/cand/{n}.txt"):
        if line.startswith("#") or not line.strip(): continue
        p = line.rstrip("\n").split("\t")
        r = rows.get(key(p[0]))
        if r is not None:
            r["cand"].append((CAND[p[1][:-3]], float(p[2]), float(p[10]), int(p[4])))

with open(f"{O}/ci_bins_sketch.tsv", "w") as w:
    w.write("run\tbinner\tbin\tMbp\tcontigs\tGC\tgtdb_WKID\tgtdb_ANI\tgtdb_complt\tgtdb_contam\tgtdb_name\tgtdb_lineage\tbest_candidate\tcand_ANI\tcand_WKID\n")
    for (run, b, name), r in sorted(rows.items()):
        h = r["hits"][0] if r["hits"] else dict(wkid=0, ani=0, complt=0, contam=0, name="no hit", lin="")
        c = max(r["cand"], key=lambda x: (x[1], x[2])) if r["cand"] else ("", "", "", "")
        w.write(f"{run}\t{b}\t{name}\t{r['bp']/1e6:.2f}\t{r['seqs']}\t{r['gc']:.3f}\t{h['wkid']}\t{h['ani']}\t{h['complt']}\t{h['contam']}\t{h['name']}\t{h['lin']}\t{c[0]}\t{c[1]}\t{c[2]}\n")
print(f"[INFO] {len(rows)} bins parsed", file=sys.stderr)

# local versions of each candidate: bins at >=95% ANI, best per run/binner by WKID
print("cand\trun\tbinner\tbin\tMbp\tcontigs\tANI\tWKID\tcand_Mbp")
for cid in range(1, 13):
    hits = []
    for (run, b, name), r in rows.items():
        for c, ani, wkid, rsize in r["cand"]:
            if c == cid and ani >= 95:
                hits.append((wkid, ani, run, b, name, r["bp"], r["seqs"], rsize))
    hits.sort(reverse=True)
    if not hits:
        print(f"{cid}\t-\t-\tno bin >=95% ANI"); continue
    for wkid, ani, run, b, name, bp, seqs, rsize in hits[:4]:
        print(f"{cid}\t{run}\t{b}\t{name}\t{bp/1e6:.2f}\t{seqs}\t{ani:.2f}\t{wkid:.1f}\t{rsize/1e6:.2f}")
