import json, csv, openpyxl, re
from collections import defaultdict, Counter

# Write site_data_dump.txt, one block per candidate MAG (quality, GTDB-Tk result, read-sketch
# hits in local samples, KEGG module completeness), which build_site_data.py reads.
#   python3 extract_site_data.py communities/<id>/build_config.json > <inputs_dir>/site_data_dump.txt
# Inputs in inputs_dir/<habitat>/ (copied from the danaSeq mag_analysis output of each
# co-assembly): mags.json, mge_per_bin.json, module_completeness.tsv, gtdbtk_taxonomy.tsv
# (or phylotree.json, see CFG "evo_source"), and the BBTools comparesketch table of local
# samples against the candidate MAGs (CFG "sketch_tables").
import os, sys
CFG_PATH = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else "build_config.json")
CFG = json.load(open(CFG_PATH, encoding="utf-8"))
def cfg_path(p):
    p = os.path.expanduser(os.path.expandvars(p))
    return p if os.path.isabs(p) else os.path.join(os.path.dirname(CFG_PATH), p)
BASE = cfg_path(CFG["inputs_dir"])
EX = CFG.get("extract", {})
# the dump covers every MAG that was ever a candidate (dropped ones stay harmless)
MAR_CANDS = EX.get("candidates", CFG["candidates"]).get("marine", [])
FW_CANDS = EX.get("candidates", CFG["candidates"]).get("freshwater", [])

# Local samples (flowcells of the community's own sequencing runs) from the sample sheet
wb = openpyxl.load_workbook(cfg_path(CFG["sample_sheet"]["xlsx"]), data_only=True)
ws = wb[CFG["sample_sheet"]["samples_tab"]]
headers = [cell.value for cell in ws[1]]
cdit_meta = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    r = dict(zip(headers, row))
    fc = str(r.get("flowcell_id") or "").strip()
    bc_raw = str(r.get("barcode") or "").strip()
    m = re.search(r"(\d+)", bc_raw)
    if fc in EX.get("local_flowcells", []) and m:
        bc_num = int(m.group(1))
        key = f"{fc}_barcode{bc_num:02d}"
        sid = str(r.get("sample_name") or r.get("sample_location") or "").strip()
        loc = str(r.get("sample_location") or "").strip()
        cdit_meta[key] = {"sample_id": sid, "location": loc, "date": str(r.get("sample_date") or "")}

def dump_hab(hab, cands, sketch_tsv):
    print(f"================ {hab.upper()} ================")
    mags = {m["name"]: m for m in json.load(open(f"{BASE}/{hab}/mags.json"))}
    
    # Taxonomy & evolution
    evo = {}
    if EX.get("evo_source", {}).get(hab, "gtdbtk_taxonomy") == "phylotree":
        pt = json.load(open(f"{BASE}/marine/phylotree.json"))
        for g in pt.get("bins", []):
            k = g["name"]
            k_dt = k if k.startswith("dastool-") else f"dastool-{k}"
            evo[k_dt] = g
    else:
        with open(f"{BASE}/freshwater/gtdbtk_taxonomy.tsv") as f:
            for r in csv.DictReader(f, delimiter="\t"):
                k = r["user_genome"]
                k_dt = k if k.startswith("dastool-") else f"dastool-{k}"
                evo[k_dt] = r

    # MGE
    mge = {}
    with open(f"{BASE}/{hab}/mge_per_bin.json") as f:
        mge_raw = json.load(f)
        if isinstance(mge_raw, list):
            for x in mge_raw:
                mge[x.get("bin", x.get("name", ""))] = x
        elif isinstance(mge_raw, dict):
            mge = mge_raw

    # Modules
    mods = defaultdict(dict)
    with open(f"{BASE}/{hab}/module_completeness.tsv") as f:
        for r in csv.DictReader(f, delimiter="\t"):
            b = r["mag_id"]
            if b == "_community": continue
            b_dt = b if b.startswith("dastool-") else f"dastool-{b}"
            for col, val in r.items():
                if col != "mag_id" and val and float(val) > 0:
                    mods[b_dt][col] = float(val)

    # Sketch hits
    sk = defaultdict(list)
    with open(sketch_tsv) as f:
        for line in f:
            if line.startswith("#") or not line.strip(): continue
            p = line.strip().split("\t")
            if len(p) >= 11 and p[1].endswith(".fa"):
                q, ref, ani, wkid = p[0], p[1][:-3], float(p[2]), float(p[10])
                if ref in cands:
                    meta = cdit_meta.get(q, {"sample_id": q, "location": "?"})
                    sk[ref].append({"sample": q, "id": meta["sample_id"], "loc": meta["location"], "date": meta["date"], "wkid": wkid, "ani": ani})

    for c in cands:
        m = mags.get(c, {})
        e = evo.get(c, {})
        print(f"\n--- {c} ---")
        print("MAG meta:", {k: m.get(k) for k in ["completeness", "contamination", "gc", "size", "n_contigs", "n50", "n_genes", "hypo_pct", "n_virus", "n_plasmid", "n_defense", "n_integron"]})
        print("Evo:", e)
        print("Top sketch hits:", sorted(sk[c], key=lambda x: -x["wkid"])[:8])
        print("Modules >=0.5:", sorted(mods[c].items(), key=lambda x: -x[1]))

for hab, cands in [("marine", MAR_CANDS), ("freshwater", FW_CANDS)]:
    if cands:
        dump_hab(hab, cands, f"{BASE}/{hab}/{EX['sketch_tables'][hab]}")
