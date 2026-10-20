# Workflow: from water samples to a naming website

This is the order the Igluligaarjuk workshop followed. Each step names its script, inputs and
outputs. Cluster steps run on Slurm with the danaSeq Apptainer containers. Before submitting
anything, export `HELPERS=<repo>/scripts/hpc` and check `scripts/hpc/env.sh`.

```
reads ──danaSeq──▶ co-assemblies + bins + annotation (mag_analysis)
                       │
     1 pick candidates ┤ ci_specific.py, examples/ci_lineage_qc.sh, read sketches
     2 improve genomes ┤ reassembly/reassemble.sh, genome_to_site.sh
     3 where they live ┤ map_to_ref.sh / danaSeq map-only, cand_abund.py, cand_identity.py
     4 collect inputs  ┤ copy outputs into inputs_dir/
     5 build data      ┤ extract_site_data.py → build_site_data.py → site_data.js
     6 write + draw    ┤ candidates.js, narratives.js, img/, community.js
     7 assemble + test ┤ assemble_site.sh, serve.py, browser
     8 deploy          ┘ deploy.sh (+ API key on the host)
```

## 0. Sequencing and assembly (danaSeq)

The reads come from nanopore runs laid out as `<run>/fastq_pass/barcodeNN/*.fastq.gz`. A
sample's id is `FLOWCELL_barcodeNN`, where the flowcell is the 4th `_` field of the run name.
The danaSeq `nanopore_assembly` and `mag_analysis` pipelines
(<https://github.com/rec3141/danaSeq>) do the following:
co-assembly per habitat (`assembly_marine`, `assembly_freshwater`), mapping of every sample,
binning with several binners plus DAS Tool, CheckM2, GTDB-Tk, Bakta/KEGG annotation, antiSMASH,
rRNA/tRNA calls and the visualisation JSON files that the build reads.

The regional co-assemblies hold hundreds of samples. Also run the community's samples alone
(`mag_<id>`, `mag_<id>_marine`, `mag_<id>_freshwater`). Bins that only form there are often the
most locally distinctive.

For a genome assembled elsewhere, use danaSeq's map-only mode (`--assembly_fasta`).
For a quick job without Nextflow, use `genome_to_site.sh`.

## 1. Pick candidate microbes

What makes a good candidate:
- **Quality**: GTDB-Tk completeness ≥ 90% and contamination ≤ 5%, ideally with a 16S, 23S
  and 5S rRNA and 18–20 of the 20 tRNA amino acids. SeqCode registration needs high quality.
- **Unnamed**: no Latin species name in GTDB. A placeholder genus (`UBA845`) or a lettered
  split (`Thioglobus_A`) decides whether the genus is new too. Lettered genera count as named.
- **Local**: most of its DNA comes from the community's samples, or at least it is
  common there. `ci_specific.py <habitat> depths.txt $LOCAL_META` ranks every bin
  by the local share of depth and the fold change over all other samples.
- **Diverse**: spread the roster over phyla and lifestyles. Twelve Gammaproteobacteria
  make a dull workshop. `examples/ci_lineage_qc.sh` shows how to QC one bin per
  under-represented lineage.
- **A story**: something a teenager can picture (eats sulfur, lives under ice, makes vitamins).

Record the chosen MAG ids in `communities/<id>/build_config.json` → `candidates`.

## 2. Improve genomes (optional)

`reassembly/reassemble.sh` (a Slurm array over `genomes.tsv`) pulls reads that map to a bin at ≥ 96%
identity. It reassembles them with Flye, drops low-coverage contigs (< 30% of the median) and
QCs the original and the reassembly side by side (`qc_summary.py` → `summary.tsv`). Keep a
reassembly only when it is at least as complete, less contaminated, and gains rRNA or tRNA
genes. Then map the samples to it with `genome_to_site.sh` or danaSeq map-only mode, and
re-run the annotation before swapping it into the site.

## 3. Where each microbe lives

- `cand_abund.sh` runs `cand_abund.py`. From the co-assembly `depths.txt` it computes per-sample
  relative abundance (% of mapped DNA), depth and breadth for each candidate, written to
  `cand_abund_<habitat>.json`.
- `cand_identity.sh` runs `cand_identity.py`. For each local sample and candidate, it
  gives the mean identity of the mapped reads. The page shows ✅ "same species" at ≥ 95%
  identity and ≥ 5 reads.
- `map_to_ref.sh <ref.fa> <input_dir[:dir2]> <samples.txt> <out>` does the same mapping for any
  reference without Nextflow. `MAX_BYTES` caps the read bases per sample (default 100 Mbp).
  It writes `depths.txt`, `cov95.tsv` (≥ 95% identity only) and `input_stats.tsv`.

A microbe counts as **detected** in a sample when ≥ 30% of its genome is covered
(`min_breadth` in build_config.json).

## 4. Collect inputs in `inputs_dir`

`build_config.json` → `inputs_dir` points to a folder laid out like this. Most files are copied
straight from the danaSeq `mag_analysis` output of each co-assembly.

```
inputs_dir/
  gtdb_r226_reps.tsv          GTDB species reps: accession, gtdb_taxonomy, gtdb_type_designation_ncbi_taxa, gtdb_type_species_of_genus (from GTDB metadata)
  bac120_r226.tree            GTDB bacterial reference tree (home-page cladogram)
  site_data_dump.txt          written by extract_site_data.py (step 5)
  <habitat>/                  marine/ and freshwater/
    mags.json mge_per_bin.json module_completeness.tsv   (danaSeq viz outputs)
    gtdbtk_taxonomy.tsv | phylotree.json                  (GTDB-Tk summary, or danaSeq phylotree)
    gtdbtk_trees/gtdbtk.bac120.classify.tree.N.tree       (GTDB-Tk classify trees)
    rrna_genes.tsv trna_genes.tsv antismash_summary.tsv dnaA.tsv es_per_mag.tsv
    <mag_id>.fa  <mag_id>.tsv                             (genome + per-protein annotation)
    cand_abund.json cand_identity.json                    (step 3)
    <local samples vs candidates>.tsv                     (BBTools comparesketch, see extract.sketch_tables)
```

## 5. Build the site data

```bash
python3 scripts/build/extract_site_data.py communities/<id>/build_config.json > <inputs_dir>/site_data_dump.txt
python3 scripts/build/build_site_data.py   communities/<id>/build_config.json   # writes communities/<id>/site_data.js
```

`build_config.json` keys:

| Key | Meaning |
|---|---|
| `inputs_dir`, `out_js` | paths. `~` and `$VARS` are expanded, and relative paths are taken from the config file's folder |
| `candidates.{marine,freshwater}` | MAG ids shown on the site |
| `tree_specs.<mag>` | which GTDB-Tk classify tree holds it (`tree_file`), leaf names to centre on (`queries`), and for ANI-only placements an `ani_sister` to draw beside it |
| `local` | the community's own station: `station`, `label`, `novel_label`, private `metadata_tsv`, `site_names` (metadata location → site label), `freshwater_sites`, `exclude_samples` |
| `sample_sheet` | the group's sequencing sheet (xlsx). Holds the tab names and the minimum Mb per barcode |
| `stations` | regional map points: name, lat, lon, region, desc, `is_ci` (the local station), `habitat` |
| `station_rules` | ordered rules from sample-sheet text to a station: `any` substrings (upper case), optional `and_regex`, optional `or_project` |
| `fallback_station` | station for samples that no rule matches, per habitat |
| `extract` | settings for extract_site_data.py: candidates (may include dropped ones), local flowcells, `evo_source` per habitat, `sketch_tables` |

Check the build log. `[WARN] stations without coordinates` means a rule points at a station
that is missing from `stations`.

## 6. Write, draw, configure

- `candidates.js`: display order, picture, habitat, nickname. The schema is in `communities/_template`.
- `narratives.js`: stories and 🔍 boxes, written from `site_data.js`. Write for high-school
  students. For existing genera, add their LPSN entry to `GENERA`, which gives the gender
  and etymology on the Naming tab.
- `img/`: one square cartoon per microbe. Record each prompt in `img/PROMPTS.md`. Make the
  pictures cell-like (no limbs), with the habitat in the background and no text.
- `community.js`: place and language strings, the dictionary credit, and `shapeGenes` from
  `scripts/hpc/shape_genes.py` (rod-shape genes decide whether endings like -bacter or
  -bacillus fit).
- `api/prompt.json`: set `language` and `env_slug`, and adapt the system prompt's community
  sentence and example.
- `site/taxon_names.js`: regenerate with `make_taxon_names.py` when GTDB releases a new version.

## 7. Assemble and test

```bash
scripts/build/assemble_site.sh <id> /private/path/dictionary.js
cd dist/<id> && python3 serve.py 8080 127.0.0.1
```

Then test every tab for one marine and one freshwater microbe. The Naming tab should search
the dictionary, catch a genus that already exists, and (with a key in `.env`) draft an
etymology. Watch the console for errors.

## 8. Deploy

See [deploy.md](deploy.md).
