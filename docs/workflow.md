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

### Adding a stand-alone genome

A genome that is not a bin of the co-assembly can also go on the site, for example a
reassembly or a bin from another assembly. Treat the whole genome as one MAG:

1. `genome_to_site.sh <genome.fa> <project>/assembly_<label> <input_dirs> <samples.txt>` maps every
   sample to it. It writes `depths.txt`, `cov95.tsv` and `input_stats.tsv` like `map_to_ref.sh`.
2. Run danaSeq `mag_analysis` on `assembly_<label>` into `mag_<label>`, with binning, dereplication
   and the binners off. If a run is preempted, resubmit it with `--resume`.
3. `genome_site_inputs.sh <label> <checkm2_completeness> <checkm2_contamination> <out_dir>` (Slurm,
   with `HELPERS` and `LOCAL_META` exported) collects that genome's site inputs into `out_dir`.
   It renames contigs to `<label>_<contig>` and writes the genome, the annotation, rRNA, tRNA,
   antiSMASH, dnaA, ecosystem services, `meta.json`, `modules.json`, and `abund.json`. Abundance
   counts only reads at ≥ 95% identity, because a genome mapped on its own also collects reads
   from its relatives. It also writes `identity.json`, from reads at ≥ 90% identity.
4. Run GTDB-Tk `classify_wf` on the new genomes together, then add each genome to
   `build_config.json` → `extra_genomes` (see step 5).
5. Write its text and add it with `scripts/build/add_microbe.py communities/<id> <spec.json>`
   (see step 6).

## 3. Where each microbe lives

The site's measure, for every microbe the same way:

1. `remap_genomes.sh <out> <input_dir[:dir2]> <samples.txt> <label>=<genome.fa> ...` maps every
   sample, with all its reads (`MAX_BYTES=0`), to all the site's genomes at once as one
   reference (contigs renamed `<label>__<contig>`), through `map_to_ref.sh`. Set `MIN_ALN=500` so
   coverage leaves out short alignments: with nanopore reads, 75-90 bp hits are mostly conserved
   stretches of other microbes' reads.
2. `site_abund.sh <label> <out_dir>` per genome (with `MAPPING_DIR=<out>/mapping`,
   `CONTIG_PREFIX=<label>__`, `MIN_ALN=500`) writes `abund.json` (depth and covered fraction from
   reads at ≥ 95% identity) and `identity.json` (mean read identity per local sample).
3. `mapped_bases.sh <coassembly>/mapping` (with the same `MIN_ALN`) counts all bases mapped per
   sample in the co-assembly BAMs: the denominator.
4. In build_config.json, `abundance_dir` points at the `site_abund.sh` outputs and `mapped_bases`
   at the two `mapped_bases.tsv` files. The build then gives every genome
   relab = its depth × length as % of all the sample's mapped bases, and the page turns that into
   cells per litre (`cells_per_litre`, `mean_genome_bp`).

Don't use the co-assembly `depths.txt` totals for this: danaSeq writes them with CoverM's
metabat mode, which for long reads keeps only a few percent of the coverage.

A microbe counts as **found** in a sample when at least `detect_min_bp` (default 250 kbp) aligns
to it at ≥ 95% identity and its covered fraction is at least `detect_breadth_ratio` (0.5) of what
that depth predicts (1 − e^−depth). A fixed cut (`min_breadth`, used only when a genome has no
length) misses real but thinly sequenced genomes.

Older, simpler tools: `cand_abund.sh`/`cand_abund.py` (share of the co-assembly `depths.txt`),
`cand_identity.sh`/`cand_identity.py` (read identity from the co-assembly BAMs), and
`map_to_ref.sh` alone (`MAX_BYTES` caps read bases per sample, default 100 Mbp; a cap keeps the
share but lowers depth and breadth). The page shows ✅ "same species" at ≥ 95% identity.

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

First measure each genome's ANI to every GTDB species with
`site_ani.sh <out_dir> <genome.fa> ...` (Slurm; name each file after the id the site uses), and set
`ani_table` and `gtdb_taxonomy` in build_config.json to its two outputs. This gives the closest
relative even when GTDB-Tk leaves it blank, and puts the ANI next to each relative on the tree.

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
| `gtdbtk_runs` | optional list of newer GTDB-Tk `classify_wf` output folders (summary, `tree.mapping` and classify trees side by side); a site genome found there takes its classification and tree from that run, e.g. to move every microbe to the same GTDB release |
| `abundance_dir`, `mapped_bases` | one abundance measure for every genome (step 3): `site_abund.sh` outputs per genome, and `{habitat: mapped_bases.tsv}` of the co-assembly mappings |
| `detect_min_bp`, `detect_breadth_ratio` | the "found" rule (step 3) |
| `cells_per_litre`, `mean_genome_bp` | how the page turns a share of mapped DNA into cells per litre: `{habitat: total cells/L}` (default 1e9) and the average genome size in the community (default 3 Mbp) |
| `canthyd` | optional `canthyd_hits.tsv` from `scripts/hpc/canthyd.sh` (CANT-HYD hydrocarbon-degradation marker genes); adds the "Oil and fuel breakdown" box to the Function tab |
| `ani_table` | optional skani search of every site genome against the GTDB species reps (`site_ani.sh`); sets the closest relative and the ANI on each tree leaf |
| `gtdb_taxonomy` | optional full GTDB taxonomy (GTDB-Tk db `taxonomy/gtdb_taxonomy.tsv`) of the newer release, to name tree leaves and skani hits |
| `ko_list` | optional KofamKOALA `ko_list`; its KO definitions describe highlighted genes whose annotation has none |
| `extra_genomes.<label>` | stand-alone genomes (step 2): `habitat`, `dir` (the `genome_site_inputs.sh` output), `tree` (GTDB-Tk classify tree file), `gtdbtk_summary`, and `domain` (`Archaea` for an archaeon, so its archaeal rRNA calls are kept; default `Bacteria`). Their abundance is shown only for the samples in that habitat's co-assembly |

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
- `scripts/build/add_microbe.py communities/<id> <spec.json>` adds or replaces one microbe in
  `candidates.js`, `narratives.js` (story and `GENERA`) and `community.js` (`shapeGenes`) in one go.
  The spec is `{"cand": {...}, "narr": {...}, "genus": {"<Genus>": {...}} or null, "shape": "mreB rodA"}`,
  with the same fields as the existing entries.
- `site/explain/`: shared explainers for the Function tab (pathways, highlighted genes,
  ecosystem-service cards), keyed by KEGG module id, gene label and CICES code. They are
  the same for every community; add an entry when a new pathway, gene label or service appears.
  `pathway_steps.js` is generated: `make_pathway_steps.py <danaSeq>/mag_analysis/bin/kegg_module_completeness.py`.
- `api/prompt.json`: set `language` and `env_slug`, and adapt the system prompt's community
  sentence and example.
- `site/taxon_names.js`: regenerate with `make_taxon_names.py` when GTDB releases a new version.

### Knowledge tab (ScIQ: science and Inuit Qaujimajatuqangit), optional

A deliberately small tab, framed for Igluligaarjuk as ScIQ, the Inuit youth idea of combining
science and IQ with the IQ principles as a guide (Pedersen et al. 2020). For each microbe: one
hook sentence, then one or two cards. The front of a card is an IQ principle; tapped, it turns
over to show a clue from the genes and one question for everyone in the workshop (youth,
Elders and scientists). Each card has an optional note box; there are no tick boxes. The
background, the eight principles and the sources sit in one collapsed "about" box.

- `site/iq_tab.js`: shared renderer, `window.renderIQ(panel, ctx)`. No community text in it;
  its defaults are neutral. It injects its own CSS (page variables `--gold`, `--fresh`,
  `--marine`, `--panel2`, `--line`, `--bg`, `--text`, `--muted` and `.card`), saves notes per
  community in `localStorage` (`iq:v2:<community id>`, memory fallback when storage is
  blocked), and exports one microbe as `.txt` or all microbes as `.csv`. Nothing is sent to a
  server.
- `communities/<id>/iq.js`: the content, `window.IQ_CONTENT = {labels, intro, principlesSource,
  principles, references, microbes: {<id>: {hook, items: [{key, clue, q}]}}}` (at most two
  items per microbe). `labels.tab` names the tab (for Igluligaarjuk "🧭 ScIQ"). One entry per
  microbe in `candidates.js`. The schema is in `communities/_template/iq.js`.
- `docs/iq_research.md`: the sources behind the Igluligaarjuk content and the design rules.

Write `hook` and `clue` from `narratives.js` so facts agree with `site_data.js`.

## 7. Assemble and test

```bash
scripts/build/assemble_site.sh <id> /private/path/dictionary.js
cd dist/<id> && python3 serve.py 8080 127.0.0.1
```

Then test every tab for one marine and one freshwater microbe. The Naming tab should search
the dictionary, catch a genus that already exists, and (with a key in `.env`) draft an
etymology. Watch the console for errors.

The card game (`cards.html`, see [card_game.md](card_game.md)) is built from the same data
when the page loads. After adding microbes, open it, check the new cards, and run
`node scripts/build/card_sim.js <id> 4000` to see whether the deck is still balanced.

## 8. Deploy

See [deploy.md](deploy.md).
