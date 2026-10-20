# One-off scripts from the Igluligaarjuk workshop

These scripts were written for single analyses. They hard-code Igluligaarjuk bin names,
flowcells or sites. Use them as patterns: copy one, change the lists at the top, and
source `../env.sh` for paths.

| Script | What it did |
|---|---|
| `ci_lineage_qc.sh` | CheckM2 + GTDB-Tk + barrnap + tRNAscan-SE on a hand-picked list of community-only bins, one per under-represented lineage, to widen the roster beyond two classes |
| `ci_shortlist_qc.sh` | The same QC on a shortlist chosen from read sketches |
| `sketch_ci_bins.sh` + `parse_ci_sketch.py` | BBTools sendsketch (GTDB) and comparesketch (against the candidates) for every community-only bin; needs a sketch server (`SKETCH_SERVER`) |
| `sketch_habitat.py` | Checked each local sample's site/habitat label against its read-sketch community profile (caught mislabelled barcodes) |
| `replacement_abund.py` | Where possible replacement candidates for a dropped microbe occur, by local site |
| `reassembly_make_list.py` | Wrote `genomes.tsv` and per-habitat local sample lists for `../reassembly/reassemble.sh` |
