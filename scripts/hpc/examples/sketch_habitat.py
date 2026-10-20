#!/usr/bin/env python3
"""Check site/habitat assignments of Chesterfield barcodes from per-read sendsketch
classifications: Bray-Curtis similarity (family level) to samples of known site,
plus marine/freshwater indicator taxa."""
import csv, collections, glob, math, os, sys
OUT = "/vistara/dana/out_dana_bc"
meta = {}
for r in csv.DictReader(open(os.environ["LOCAL_META"]), delimiter="\t"):
    meta[f"{r['flowcell']}_{r['barcode']}"] = (r["station_id"], r["location"], (r.get("") or "").strip())
MARINE_SITES = {"Itivia", "Dock", "Tuktuttaa", "Tuktuttaa algae"}
# indicator taxa (substring of lineage) -> habitat
IND = {
    "marine": ["g__Pelagibacter;", "g__Thioglobus", "f__Pseudothioglobaceae", "g__Polaribacter", "g__Nitrosopumilus", "o__Rhodobacterales", "f__Rhodobacteraceae",
               "g__Planktomarina", "g__Amylibacter", "f__Porticoccaceae", "g__Synechococcus", "c__Bathyarchaeia", "f__Nitrincolaceae", "g__Sulfitobacter", "f__Saccharospirillaceae",
               "f__Marinomonadaceae", "f__Colwelliaceae", "g__Colwellia", "g__Psychromonas", "f__Oceanospirillaceae", "SAR86", "f__D2472", "g__Ascidiaceihabitans", "o__Puniceispirillales"],
    "fresh": ["g__Polynucleobacter", "g__Limnohabitans", "o__Nanopelagicales", "g__Planktophila", "g__Nanopelagicus", "g__Rhodoferax", "g__Methylopumilus", "g__Fonsibacter",
              "g__Sediminibacterium", "g__Ferruginibacter", "g__Flavobacterium;", "f__Burkholderiaceae", "g__Rhodoluna", "g__Aquirufa", "g__Pseudarcicella", "g__Polaromonas",
              "f__Comamonadaceae", "g__Nitrotoga", "f__Gallionellaceae", "g__Curvibacter", "g__Paucibacter", "o__Chitinophagales"],
}
prof, ind, nreads = {}, {}, {}
for f in sorted(glob.glob(f"{OUT}/FAZ28565/barcode*/sketch/*.sendsketch_reads.tsv") + glob.glob(f"{OUT}/FAZ82377/barcode*/sketch/*.sendsketch_reads.tsv")
                + glob.glob(f"{OUT}/FAZ82916/barcode*/sketch/*.sendsketch_reads.tsv")):
    s = os.path.basename(f).split(".")[0]
    fam = collections.Counter(); hab = collections.Counter(); n = 0
    for r in csv.DictReader(open(f), delimiter="\t"):
        if r["status"] != "C": continue
        n += 1
        lin = r["lineage"] + ";"
        parts = dict(p.split("__", 1) for p in lin.split(";") if "__" in p)
        fam[parts.get("f") or parts.get("o") or parts.get("c") or "?"] += 1
        for h, keys in IND.items():
            if any(k in lin for k in keys): hab[h] += 1; break
    tot = sum(fam.values()) or 1
    prof[s] = {k: v / tot for k, v in fam.items()}; ind[s] = hab; nreads[s] = n

def bc(a, b):
    ks = set(a) | set(b)
    return 1 - sum(abs(a.get(k, 0) - b.get(k, 0)) for k in ks) / 2

known = {s: meta[s][1] for s in prof if s in meta and not meta[s][2] and meta[s][1]}
print("sample\tstation\tlisted_site\tclassified_reads\tmarine_ind\tfresh_ind\tbest_matches(similarity)\tmean_sim_marine\tmean_sim_fresh\tverdict")
for s in sorted(prof, key=lambda x: (x not in meta or not meta[x][2], x)):
    st, loc, flag = meta.get(s, ("?", "?", ""))
    refs = sorted(((bc(prof[s], prof[k]), k) for k in known if k != s), reverse=True)
    m = [v for v, k in refs if known[k] in MARINE_SITES]; fw = [v for v, k in refs if known[k] not in MARINE_SITES]
    mm, mf = sum(m) / max(1, len(m)), sum(fw) / max(1, len(fw))
    top = ", ".join(f"{known[k]}:{meta[k][0]}({v:.2f})" for v, k in refs[:3])
    mi, fi = ind[s]["marine"], ind[s]["fresh"]
    verdict = "marine" if mm > mf and mi >= fi else "freshwater" if mf > mm and fi >= mi else "mixed"
    listed = "marine" if loc in MARINE_SITES else "freshwater" if loc else "?"
    print(f"{s}\t{st}\t{loc}{' ('+flag+')' if flag else ''}\t{nreads[s]}\t{mi}\t{fi}\t{top}\t{mm:.2f}\t{mf:.2f}\t{verdict}{'' if verdict==listed else '  <-- differs from listed ' + listed}")
