#!/usr/bin/env python3
"""Rank every bin (all binners) in a co-assembly by how locally specific
it is, regardless of quality.

  ci_share  = share of the bin's summed per-sample depth that comes from the
              local samples (uniform presence would give n_ci/n_samples)
  fold      = mean depth in local samples / mean depth in all others
  max_other = highest depth in any single non-local sample

Bins of the same genome from different binners are collapsed (>=50% shared bp
of the smaller bin); each group is reported by its most specific member, with
its best-quality member alongside.
    ci_specific.py <marine|freshwater> [depths.txt] [ci_metadata.tsv] > out.tsv

With a metadata TSV (flowcell, barcode, location, ...), local samples are
taken from it: those at sites of this habitat count as CI; local samples
from the other habitat are left out of both groups. Per-site mean depths are added.
"""
import csv, collections, glob, os, sys

hab = sys.argv[1]
R = os.path.join(os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore")), f"mag_{hab}")
DEPTHS = sys.argv[2] if len(sys.argv) > 2 else f"{R}/mapping/depths.txt"
EXCLUDE = set(filter(None, os.environ.get("LOCAL_EXCLUDE", "").split(",")))  # env.sh, e.g. extraction controls
SITE = {}  # sample -> site (Chesterfield samples only)
if len(sys.argv) > 3:
    MARINE_SITES = set(filter(None, os.environ.get("LOCAL_MARINE_SITES", "").split(",")))  # env.sh
    for r in csv.DictReader(open(sys.argv[3]), delimiter="\t"):
        loc = r["location"].strip()
        if not loc:
            continue
        s = f"{r['flowcell']}_{r['barcode']}"
        if (loc in MARINE_SITES) == (hab == "marine"):
            SITE[s] = loc.replace("Tuktuttaa algae", "Tuktuttaa")
        else:
            EXCLUDE.add(s)  # local sample from the other habitat
    CI = list(SITE)
else:
    sys.exit("[ERROR] give the local metadata TSV (env.sh LOCAL_META) as the third argument")
MIN_BP = 300_000
MIN_CI_DEPTH = 0.5
csv.field_size_limit(sys.maxsize)


def tsv(p):
    return csv.DictReader(open(p), delimiter="\t")


clen = {r[0]: int(r[1]) for r in csv.reader(open(f"{R}/assembly/assembly_info.txt"), delimiter="\t") if r and not r[0].startswith("#")}
bin2c = collections.defaultdict(set)
for b in ["comebin", "lorbin", "maxbin", "metabat", "semibin", "vamb", "binette"]:
    p = f"{R}/binning/{b}/{b}_bins.tsv"
    if os.path.exists(p):
        for r in csv.reader(open(p), delimiter="\t"):
            if len(r) >= 2:
                bin2c[r[1]].add(r[0])
for r in csv.reader(open(f"{R}/binning/dastool/contig2bin.tsv"), delimiter="\t"):
    bin2c[r[1]].add(r[0])
bins = {b: cs for b, cs in bin2c.items() if sum(clen.get(c, 0) for c in cs) >= MIN_BP}
print(f"[INFO] {hab}: {len(bin2c)} bins, {len(bins)} >= {MIN_BP/1e3:.0f} kbp", file=sys.stderr)
need = set().union(*bins.values())

# per contig: CI depths, sum/mean/max over other samples
cd = {}
with open(DEPTHS) as f:
    hdr = f.readline().rstrip("\n").split("\t")
    samp = [(i, hdr[i].replace(".sorted.bam", "")) for i in range(len(hdr)) if hdr[i].endswith(".bam")]
    ci_i = [i for i, s in samp if s in CI]
    ot_i = [i for i, s in samp if s not in CI and s not in EXCLUDE]
    ot_name = {i: s for i, s in samp}
    ci_names = [s for i, s in samp if s in CI]
    print(f"[INFO] CI samples in table: {len(ci_i)} of {len(CI)}; missing: {sorted(set(CI) - set(ci_names))}", file=sys.stderr)
    for line in f:
        k = line.split("\t", 1)[0]
        if k not in need:
            continue
        p = line.split("\t")
        ci = [float(p[i]) for i in ci_i]
        ot = [float(p[i]) for i in ot_i]
        mx = max(range(len(ot)), key=ot.__getitem__)
        cd[k] = (ci, sum(ot), ot[mx], ot_i[mx])
n_ci, n_ot = len(ci_i), len(ot_i)
print(f"[INFO] {n_ci} CI samples, {n_ot} other samples; uniform ci_share = {n_ci/(n_ci+n_ot)*100:.1f}%", file=sys.stderr)

# quality + taxonomy
gq = {}
for d in glob.glob(f"{R}/taxonomy/gtdbtk*/gtdbtk_markers"):
    for dom, tot in [("bac120", 120), ("ar53", 53)]:
        p = f"{d}/gtdbtk.{dom}.markers_summary.tsv"
        if os.path.exists(p):
            for r in tsv(p):
                u, m = int(r["number_unique_genes"]), int(r["number_multiple_genes"])
                if r["name"] not in gq or u > gq[r["name"]][2]:
                    gq[r["name"]] = (u / tot * 100, m / tot * 100, u)
cq = {}
for p in sorted(glob.glob(f"{R}/binning/checkm2*/quality_report.tsv")):
    for r in tsv(p):
        cq.setdefault(r["Name"], (float(r["Completeness"]), float(r["Contamination"])))
tax = {}
for p in glob.glob(f"{R}/taxonomy/gtdbtk*/gtdbtk_taxonomy.tsv"):
    for r in tsv(p):
        tax[r["user_genome"]] = (r["classification"], r.get("closest_genome_ani", ""))
rr = collections.defaultdict(collections.Counter)
for r in tsv(f"{R}/taxonomy/rrna/rrna_genes.tsv"):
    if r.get("best", "True") == "True" and r["kingdom"] == "Bacteria" and float(r["gene_completeness"] or 0) >= 0.5:
        rr[r["contig_id"]][r["rrna_type"].replace("_rRNA", "")] += 1

rows = []
for b, cs in bins.items():
    cs = [c for c in cs if c in cd]
    bp = sum(clen[c] for c in cs)
    if not bp:
        continue
    ci = [sum(cd[c][0][k] * clen[c] for c in cs) / bp for k in range(n_ci)]
    ot_sum = sum(cd[c][1] * clen[c] for c in cs) / bp
    ci_sum = sum(ci)
    if max(ci) < MIN_CI_DEPTH:
        continue
    # max single other sample, length-weighted per sample is costly; use the
    # worst contig-level max weighted by length as an upper-bound indicator
    mo = sum(cd[c][2] * clen[c] for c in cs) / bp
    top_other = collections.Counter()
    for c in cs:
        top_other[ot_name[cd[c][3]]] += clen[c]
    rows.append(dict(bin=b, cs=set(cs), bp=bp, ci=ci, share=ci_sum / (ci_sum + ot_sum),
                     fold=(ci_sum / n_ci) / max(ot_sum / n_ot, 1e-6), max_other=mo,
                     top_other=top_other.most_common(1)[0][0]))


def quality(b):
    g, c = gq.get(b), cq.get(b)
    comp = g[0] if g else (c[0] if c else 0)
    cont = g[1] if g else (c[1] if c else 100)
    return comp - 5 * cont


rows.sort(key=lambda r: -r["share"])
groups = []
for r in rows:
    for g in groups:
        sh = sum(clen[c] for c in r["cs"] & g["cs"])
        if sh >= 0.5 * min(r["bp"], g["bp"]):
            g["members"].append(r["bin"])
            break
    else:
        r["members"] = [r["bin"]]
        groups.append(r)


def q(b):
    g, c = gq.get(b), cq.get(b)
    return (f"{g[0]:.1f}/{g[1]:.1f}" if g else "n/a"), (f"{c[0]:.1f}/{c[1]:.1f}" if c else "n/a")


sites = sorted({SITE.get(s, "CI") for s in ci_names})
def site_means(ci):
    out = []
    for st in sites:
        v = [x for x, s in zip(ci, ci_names) if SITE.get(s, "CI") == st]
        out.append(f"{st}:{sum(v) / max(1, len(v)):.2f}({sum(1 for x in v if x >= 0.5)}/{len(v)})")
    return " ".join(out)
print("rank\tbin\tci_share%\tfold\tsite_mean_depth(n>=0.5x/n)\tother_mean\tmax_other_ctg\ttop_other_sample\tMbp\tGTDB\tCM2\trRNA16/23/5\tbest_member\tbest_GTDB\tbest_CM2\tclassification\tclosest_ANI\tn_members")
for i, g in enumerate(groups, 1):
    b = g["bin"]
    best = max(g["members"], key=quality)
    rc = collections.Counter()
    for c in bins[best]:
        rc += rr[c]
    t = tax.get(best) or tax.get(b) or ("", "")
    gb, cb = q(b)
    gbe, cbe = q(best)
    print(f"{i}\t{b}\t{g['share']*100:.1f}\t{g['fold']:.1f}\t{site_means(g['ci'])}\t"
          f"{(sum(g['ci'])/g['share']-sum(g['ci']))/n_ot:.3f}\t{g['max_other']:.2f}\t{g['top_other']}\t{g['bp']/1e6:.2f}\t{gb}\t{cb}\t"
          f"{rc['16S']}/{rc['23S']}/{rc['5S']}\t{best}\t{gbe}\t{cbe}\t{';'.join(t[0].split(';')[-4:])}\t{t[1]}\t{len(g['members'])}")
