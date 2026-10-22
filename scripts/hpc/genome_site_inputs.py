#!/usr/bin/env python3
"""Collect one stand-alone genome's site inputs (the files build_site_data.py reads per MAG)
from its genome_to_site.sh mapping (assembly_<label>/) and danaSeq mag_analysis run
(mag_<label>/), treating the whole assembly as one MAG.

    genome_site_inputs.py <label> <checkm2_completeness> <checkm2_contamination> <out_dir>

Contigs are renamed <label>_<contig> everywhere, so several genomes can share the habitat
tables. Writes to out_dir:
  <label>.fa  <label>.tsv (per-protein annotation)  rrna_genes.tsv  trna_genes.tsv
  antismash_summary.tsv  dnaA.tsv  es_catalog.tsv (+ contig2bin.tsv for aggregate_bins.py)
  meta.json   (MAG meta line for site_data_dump.txt)
  modules.json (KEGG module completeness of the whole genome, the run's _community row)
  abund.json and identity.json are written by site_abund.sh, which the .sh wrapper runs.
Python 3.6 compatible (Grex login nodes).
"""
import csv, json, os, sys

label, cm_comp, cm_cont, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
P = os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore"))
A, M = "%s/assembly_%s" % (P, label), "%s/mag_%s" % (P, label)
os.makedirs(out, exist_ok=True)
ren = lambda c: "%s_%s" % (label, c)
csv.field_size_limit(sys.maxsize)


def rows(path, comment_header=False):
    with open(path) as f:
        lines = [l for l in f if not (l.startswith("# ") or (l.startswith("#") and not comment_header))]
    if comment_header and lines and lines[0].startswith("#"):
        lines[0] = lines[0][1:]
    return list(csv.DictReader(lines, delimiter="\t"))


def write(path, fields, rs):
    with open(path, "w") as w:
        wr = csv.DictWriter(w, fieldnames=fields, delimiter="\t", extrasaction="ignore", lineterminator="\n")
        wr.writeheader()
        for r in rs:
            wr.writerow(r)


# genome
seqs, order, cur = {}, [], None
for line in open("%s/assembly/assembly.fasta" % A):
    if line.startswith(">"):
        cur = line[1:].split()[0]; order.append(cur); seqs[cur] = []
    else:
        seqs[cur].append(line.strip().upper())
seqs = {c: "".join(s) for c, s in seqs.items()}
with open("%s/%s.fa" % (out, label), "w") as w:
    for c in order:
        w.write(">%s\n" % ren(c))
        for i in range(0, len(seqs[c]), 80):
            w.write(seqs[c][i:i + 80] + "\n")
lens = sorted((len(s) for s in seqs.values()), reverse=True)
total = sum(lens)
acc, n50 = 0, 0
for L in lens:
    acc += L
    if acc >= total / 2:
        n50 = L; break
gc = sum(s.count("G") + s.count("C") for s in seqs.values()) / max(1, sum(sum(s.count(b) for b in "ACGT") for s in seqs.values()))

# annotation: Bakta gives the contig of each protein, merged_annotations the functions
bakta = rows("%s/annotation/bakta/basic/annotation.tsv" % M, comment_header=True)
contig_of = {r["Locus Tag"]: r["Sequence Id"] for r in bakta if r.get("Locus Tag")}
merged = rows("%s/metabolism/merged/merged_annotations.tsv" % M)
fields = ["protein_id", "contig_id", "KO", "COG_category", "GOs", "EC", "KEGG_Pathway", "PFAMs", "CAZy", "description", "bin_id"]
ann = []
for r in merged:
    c = contig_of.get(r["protein_id"])
    if c:
        r = dict(r, contig_id=ren(c), bin_id=label); ann.append(r)
write("%s/%s.tsv" % (out, label), fields, ann)
cds = [r for r in bakta if r["Type"] == "cds"]
n_hypo = sum(1 for r in cds if "hypothetical" in r["Product"].lower())
with open("%s/dnaA.tsv" % out, "w") as w:
    for r in cds:
        if r["Gene"] == "dnaA":
            w.write("\t".join([ren(r["Sequence Id"]), "cds", r["Start"], r["Stop"], r["Strand"], r["Locus Tag"], r["Gene"], r["Product"]]) + "\n")

# rRNA, tRNA, antiSMASH
for name in ("rrna_genes", "trna_genes"):
    rs = rows("%s/taxonomy/rrna/%s.tsv" % (M, name))
    hdr = list(rs[0].keys()) if rs else ["gene_id", "contig_id"]
    for r in rs:
        r["gene_id"] = r["gene_id"].replace(r["contig_id"], ren(r["contig_id"]))
        r["contig_id"] = ren(r["contig_id"])
    write("%s/%s.tsv" % (out, name), hdr, rs)
asm = rows("%s/metabolism/antismash/antismash_summary.tsv" % M)


def region_gbk(region):
    """start, end and product(s) of one antiSMASH region from its GenBank file, for summaries
    whose columns came out NA (some danaSeq versions write only the region names)."""
    path = "%s/metabolism/antismash/antismash_geneclusters/%s.gbk" % (M, region)
    if not os.path.exists(path):
        return {}
    start = end = None
    prods, in_region = [], False
    for line in open(path):
        if "Orig. start ::" in line:
            start = line.split("::")[1].strip()
        elif "Orig. end" in line and "::" in line:
            end = line.split("::")[1].strip()
        elif line[5:21].strip():  # a new feature key in the FEATURES table
            in_region = line[5:21].strip() == "region"
        elif in_region and line.strip().startswith('/product="'):
            prods.append(line.strip()[10:].rstrip('"'))
    return {"start": start or "NA", "end": end or "NA", "type": ".".join(prods) or "NA"}


for r in asm:
    if r.get("type") in (None, "", "NA"):
        r.update(region_gbk(r["region"]))
    c = r["region"].rsplit(".region", 1)[0]
    r["region"] = ren(r["region"])
    if r.get("contig") not in (None, "", "NA"):
        r["contig"] = ren(r["contig"])
    else:
        r["contig"] = ren(c)
write("%s/antismash_summary.tsv" % out, ["region", "contig", "start", "end", "type", "most_similar_known_cluster", "similarity"], asm)

# ecosystem services: gene catalog with renamed contigs + all contigs in one bin
cat = rows("%s/metabolism/ecossdb/es_gene_catalog.tsv" % M)
for r in cat:
    r["contig_id"] = ren(r["contig_id"])
write("%s/es_catalog.tsv" % out, list(cat[0].keys()) if cat else ["protein_id", "contig_id"], cat)
with open("%s/contig2bin.tsv" % out, "w") as w:
    for c in order:
        w.write("%s\t%s\n" % (ren(c), label))

# KEGG modules of the whole genome
mods = {}
for r in rows("%s/metabolism/modules/module_completeness.tsv" % M):
    if r["mag_id"] == "_community":
        mods = {k: float(v) for k, v in r.items() if k != "mag_id" and v and float(v) > 0}
json.dump(sorted(mods.items(), key=lambda x: -x[1]), open("%s/modules.json" % out, "w"))

# mobile elements
def count(path):
    return max(0, sum(1 for _ in open(path)) - 1) if os.path.exists(path) else 0
meta = {"completeness": cm_comp, "contamination": cm_cont, "gc": round(gc, 2), "size": total, "n_contigs": len(order),
        "n50": n50, "n_genes": len(cds), "hypo_pct": round(100.0 * n_hypo / max(1, len(cds)), 1),
        "n_virus": count("%s/mge/genomad/virus_summary.tsv" % M), "n_plasmid": count("%s/mge/genomad/plasmid_summary.tsv" % M),
        "n_defense": 0, "n_integron": 0}
json.dump(meta, open("%s/meta.json" % out, "w"))

print("[INFO] %s: %d contigs, %.2f Mbp, %d proteins, %d modules" % (label, len(order), total / 1e6, len(ann), len(mods)), file=sys.stderr)
