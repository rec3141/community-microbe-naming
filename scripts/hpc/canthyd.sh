#!/bin/bash
# CANT-HYD hydrocarbon-degradation marker genes (Khot et al. 2022, Front. Microbiol. 12:764058; 37 curated HMMs with
# trusted and noise cutoffs) in each site genome: Prodigal proteins, then hmmsearch --cut_nc, in
# the danaSeq mag_analysis container. Writes <out_dir>/canthyd_hits.tsv:
#   genome, protein, contig, start, end, model, description, score, trusted cutoff, noise cutoff,
#   confidence ("confident" at or above the trusted cutoff, else "possible")
#   canthyd.sh <CANT-HYD.hmm> <out_dir> <genome.fa> [genome.fa ...]   (genome name = file name)
#SBATCH --partition=genoa,genoacpu-b,genlm
#SBATCH --cpus-per-task=16
#SBATCH --mem=16G
#SBATCH --time=2:00:00
#SBATCH --job-name=canthyd
set -euo pipefail
source "${HELPERS:?export HELPERS=<repo>/scripts/hpc}/env.sh"
HMM=$(readlink -f "$1"); OUT=$(readlink -m "$2"); shift 2
mkdir -p "$OUT/faa"
for fa in "$@"; do ln -sf "$(readlink -f "$fa")" "$OUT/faa/"; done
apptainer exec -B "$BIND_DIR" -B "$OUT" -B "$(dirname "$HMM")" "$MAG_SIF" bash -c "
    source /opt/conda/etc/profile.d/conda.sh && conda activate /opt/conda/envs/dana-mag-annotate
    set -euo pipefail; cd '$OUT'
    for fa in faa/*.fa; do g=\$(basename \$fa .fa)
        [ -s faa/\$g.faa ] || prodigal -q -p single -i \$fa -a faa/\$g.faa -o /dev/null
        hmmsearch --cut_nc --cpu \${SLURM_CPUS_PER_TASK:-4} --noali --tblout faa/\$g.tbl '$HMM' faa/\$g.faa > /dev/null
    done"
python3 - "$HMM" "$OUT" <<'PY'
import glob, os, sys
hmm, out = sys.argv[1:3]
cut, desc, name = {}, {}, None
for line in open(hmm):
    if line.startswith("NAME"):
        name = line.split()[1]
    elif line.startswith("DESC") and name:
        desc[name] = line[6:].strip()
    elif line.startswith(("TC ", "NC ")) and name:
        cut.setdefault(name, {})[line[:2]] = float(line.split()[1])
rows = []
for tbl in sorted(glob.glob(f"{out}/faa/*.tbl")):
    g = os.path.basename(tbl)[:-4]
    for line in open(tbl):
        if line.startswith("#"):
            continue
        f = line.split()
        prot, model, score = f[0], f[2], float(f[5])
        # Prodigal header: >contig_N # start # end # strand # ...
        hdr = " ".join(f[18:])
        parts = [x.strip() for x in hdr.split("#")]
        start, end = (parts[1], parts[2]) if len(parts) > 2 else ("", "")
        contig = prot.rsplit("_", 1)[0]
        tc, nc = cut.get(model, {}).get("TC"), cut.get(model, {}).get("NC")
        rows.append([g, prot, contig, start, end, model, desc.get(model, ""), f"{score:.1f}", tc, nc,
                     "confident" if tc is not None and score >= tc else "possible"])
with open(f"{out}/canthyd_hits.tsv", "w") as w:
    w.write("genome\tprotein\tcontig\tstart\tend\tmodel\tdescription\tscore\ttrusted_cutoff\tnoise_cutoff\tconfidence\n")
    for r in rows:
        w.write("\t".join(str(x) for x in r) + "\n")
print(f"[INFO] {len(rows)} CANT-HYD hits in {len(glob.glob(out + '/faa/*.tbl'))} genomes", file=sys.stderr)
PY
