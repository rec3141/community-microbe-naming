#!/usr/bin/env python3
"""Summarise CheckM2 + GTDB-Tk + barrnap + tRNAscan-SE results in the current QC directory."""
import csv, glob, os, re
AA = set("Ala Arg Asn Asp Cys Gln Glu Gly His Ile Leu Lys Met Phe Pro Ser Thr Trp Tyr Val".split())
cm = {r["Name"]: r for r in csv.DictReader(open("checkm2_out/quality_report.tsv"), delimiter="\t")}
g = {}
for dom, tot in [("bac120", 120), ("ar53", 53)]:
    for f in glob.glob(f"gtdbtk_out/identify/gtdbtk.{dom}.markers_summary.tsv"):
        for r in csv.DictReader(open(f), delimiter="\t"):
            u, m = int(r["number_unique_genes"]), int(r["number_multiple_genes"])
            if r["name"] not in g or u > g[r["name"]][0]:
                g[r["name"]] = (u, m, tot)
tax = {}
for f in glob.glob("gtdbtk_out/gtdbtk.*.summary.tsv"):
    for r in csv.DictReader(open(f), delimiter="\t"):
        tax[r["user_genome"]] = (r["classification"], r.get("closest_genome_ani", ""), r.get("classification_method", ""),
                                 r.get("closest_genome_reference", ""), r.get("closest_placement_ani", ""), r.get("red_value", ""))
print("bin\tgtdb_comp\tgtdb_cont\tcheckm2_comp\tcheckm2_cont\tMbp\tcontigs\t16S\t23S\t5S\ttRNA_aa\tmissing_aa\tclosest_ANI\tmethod\tRED\tclassification")
for n in sorted(cm):
    u, m, tot = g.get(n, (0, 0, 120))
    rr = {"16S": 0, "23S": 0, "5S": 0}
    p = f"rna/{n}.rrna.gff"
    if os.path.exists(p):
        for line in open(p):
            mm = re.search(r"Name=(\d+S)_rRNA", line)
            if mm and "partial" not in line:
                rr[mm.group(1)] = rr.get(mm.group(1), 0) + 1
    aa = set()
    p = f"rna/{n}.trna.txt"
    if os.path.exists(p):
        for line in open(p):
            f = line.split("\t")
            if len(f) > 4 and f[4].strip() in AA:
                aa.add(f[4].strip())
    t = tax.get(n, ("", "", "", "", "", ""))
    print("\t".join([n, f"{u/tot*100:.1f}", f"{m/tot*100:.1f}", cm[n]["Completeness"], cm[n]["Contamination"],
                     f"{int(cm[n]['Genome_Size'])/1e6:.2f}", cm[n]["Total_Contigs"], str(rr["16S"]), str(rr["23S"]), str(rr["5S"]),
                     str(len(aa)), ",".join(sorted(AA - aa)), t[1], t[2][:28], t[5], t[0]]))
