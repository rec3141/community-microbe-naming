#!/usr/bin/env python3
"""Write genomes.tsv (label, bin fasta, BAM dir, sample list) and the local sample lists.
Example from Igluligaarjuk: edit MAR (marine site names), rows and W for a new community."""
import csv, os
P = os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore"))
ci = {"marine": [], "freshwater": []}
MAR = {"Itivia", "Dock", "Tuktuttaa", "Tuktuttaa algae"}
for r in csv.DictReader(open(os.environ["LOCAL_META"]), delimiter="\t"):
    loc = r["location"].strip()
    if loc:
        ci["marine" if loc in MAR else "freshwater"].append(r["flowcell"] + "_" + r["barcode"])
for h, v in ci.items():
    open(f"ci_{h}.txt", "w").write("\n".join(sorted(v)) + "\n")
rows = [
    # label, bin fasta, BAM dir, samples (ALL = every BAM in the dir)
    ("A2_Planktophila_semibin_003", f"{P}/mag_chesterfield_freshwater/binning/semibin/bins/semibin_003.fa", f"{P}/assembly_chesterfield_freshwater/mapping", "ALL"),
    ("D_Bdellovibrio_lorbin_002", f"{P}/mag_chesterfield_marine/binning/lorbin/bins/lorbin_002.fa", f"{P}/assembly_chesterfield_marine/mapping", "ALL"),
    ("E_UBA845_lorbin_004", f"{P}/mag_chesterfield_marine/binning/lorbin/bins/lorbin_004.fa", f"{P}/assembly_chesterfield_marine/mapping", "ALL"),
    ("K1_Pseudothioglobus_metabat_359", f"{P}/mag_chesterfield/binning/metabat/bins/metabat_359.fa", f"{P}/assembly_chesterfield/mapping", "ALL"),
    ("C_Peredibacter_metabat_555", f"{P}/mag_chesterfield_marine/binning/metabat/bins/metabat_555.fa", f"{P}/assembly_chesterfield_marine/mapping", "ALL"),
    ("G_CAISJI01_lorbin_005", f"{P}/mag_chesterfield_freshwater/binning/lorbin/bins/lorbin_005.fa", f"{P}/assembly_chesterfield_freshwater/mapping", "ALL"),
    ("B_Planktophila_lorbin_017", f"{P}/mag_chesterfield_freshwater/binning/lorbin/bins/lorbin_017.fa", f"{P}/assembly_chesterfield_freshwater/mapping", "ALL"),
]
# the 12 workshop genomes: reads from the Chesterfield samples only, from the co-assembly BAMs
W = {"marine": ["lorbin_055", "lorbin_162", "metabat_11223", "semibin_075", "lorbin_002", "lorbin_051"],
     "freshwater": ["comebin_6520", "comebin_832", "comebin_4228", "lorbin_069", "comebin_3630", "lorbin_054"]}
n = 0
for h, bins in W.items():
    for b in bins:
        n += 1
        rows.append((f"W{n:02d}_{b}", f"{P}/mag_{h}/binning/dastool/bins/dastool-{b}.fa", f"{P}/assembly_{h}/mapping", f"{P}/reassembly/ci_{h}.txt"))
with open("genomes.tsv", "w") as w:
    for r in rows:
        w.write("\t".join(r) + "\n")
