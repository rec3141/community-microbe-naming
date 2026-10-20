#!/usr/bin/env python3
"""Where are the replacement candidates for microbe 8, and how specific to Chesterfield?
For each genome: find the co-assembly contigs that are the same genome (>=96% identity over
>=80% of the contig, minimap2 asm5 inside the danaSeq container), then report its share of
the mapped DNA per sample from the co-assembly depth table, summarised by Chesterfield site
and for the rest of the region. Genomes that already are co-assembly bins use their contigs.
    replacement_abund.py <out.tsv>
"""
import collections, csv, os, subprocess, sys

P = os.environ.get("PROJECT", os.path.expanduser("~/scratch/project_nanopore"))
SIF = os.path.realpath(os.environ.get("MAG_SIF", os.path.expanduser("~/GENICE/danaSeq/mag_analysis/.danaseq-mag-analysis.sif")))
DEPTHS = f"{P}/assembly_freshwater/mapping/depths.txt.remap-20261019"
ASM = f"{P}/assembly_freshwater/assembly/assembly.fasta"
GENOMES = {
    "A2_Planktophila_reassembly": ("fasta", f"{P}/reassembly/A2_Planktophila_semibin_003/qc/reassembly.fa"),
    "vamb_108_Polynucleobacter": ("bin", "vamb_108"),
    "microbe8_comebin_832": ("bin", "dastool-comebin_832"),
}
MAR = {"Itivia", "Dock", "Tuktuttaa", "Tuktuttaa algae"}
site = {}
for r in csv.DictReader(open(os.environ["LOCAL_META"]), delimiter="\t"):
    loc = r["location"].strip()
    if loc and loc not in MAR:
        site[f"{r['flowcell']}_{r['barcode']}"] = loc.replace("_", " ")

contigs = {}
for g, (kind, src) in GENOMES.items():
    if kind == "bin":
        cs = set()
        for b in ["comebin", "lorbin", "maxbin", "metabat", "semibin", "vamb", "binette"]:
            p = f"{P}/mag_freshwater/binning/{b}/{b}_bins.tsv"
            if os.path.exists(p):
                cs |= {r[0] for r in csv.reader(open(p), delimiter="\t") if len(r) > 1 and r[1] == src}
        cs |= {r[0] for r in csv.reader(open(f"{P}/mag_freshwater/binning/dastool/contig2bin.tsv"), delimiter="\t") if r[1] == src}
        contigs[g] = cs
    else:
        cmd = ["apptainer", "exec", "-B", os.environ.get("BIND_DIR", os.path.realpath(os.path.expanduser("~/scratch"))), "-B", os.path.expanduser("~"), SIF, "bash", "-c",
               f"source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-assembly && minimap2 -x asm5 -t 8 {src} {ASM}"]
        aln, qlen = collections.Counter(), {}
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, universal_newlines=True)
        for line in p.stdout:
            f = line.split("\t")
            if int(f[10]) and int(f[9]) / int(f[10]) >= 0.96:
                aln[f[0]] += int(f[3]) - int(f[2])
                qlen[f[0]] = int(f[1])
        p.wait()
        contigs[g] = {q for q in aln if qlen[q] >= 2000 and aln[q] >= 0.8 * qlen[q]}
    print(f"[INFO] {g}: {len(contigs[g])} co-assembly contigs", file=sys.stderr)

need = set().union(*contigs.values())
with open(DEPTHS) as f:
    hdr = f.readline().rstrip("\n").split("\t")
    idx = [i for i, h in enumerate(hdr) if h.endswith(".bam")]
    names = [hdr[i].replace(".sorted.bam", "") for i in idx]
    total = [0.0] * len(idx)
    gbp = {g: [0.0] * len(idx) for g in contigs}
    glen = collections.Counter()
    gcov = {g: [0] * len(idx) for g in contigs}
    for line in f:
        p = line.split("\t")
        L = int(p[1])
        inn = [g for g in contigs if p[0] in contigs[g]]
        for g in inn:
            glen[g] += L
        for k, i in enumerate(idx):
            v = float(p[i])
            if v:
                total[k] += v * L
                for g in inn:
                    gbp[g][k] += v * L
                    gcov[g][k] += L

with open(sys.argv[1], "w") as w:
    w.write("genome\tgenome_Mbp\tgroup\tn_samples\tfound(>=30%genome)\tmean_share%\tmax_share%\tmax_sample\n")
    for g in contigs:
        groups = collections.defaultdict(list)
        for k, s in enumerate(names):
            groups[site.get(s, "rest of region")].append(k)
        for grp, ks in sorted(groups.items()):
            sh = [100 * gbp[g][k] / total[k] if total[k] else 0 for k in ks]
            fnd = sum(1 for k in ks if glen[g] and gcov[g][k] / glen[g] >= 0.3)
            mx = max(range(len(ks)), key=lambda j: sh[j])
            w.write(f"{g}\t{glen[g]/1e6:.2f}\t{grp}\t{len(ks)}\t{fnd}\t{sum(sh)/len(sh):.4f}\t{sh[mx]:.3f}\t{names[ks[mx]]}\n")
