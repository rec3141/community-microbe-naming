# Split Lake (Manitoba)

Second community site, built from the Igluligaarjuk template. Samples: only those in the
user's Split Lake sample list (`~/split-lake_inputs/metadata_split-lake.tsv`): the August 2024
survey of Split Lake, Assean and Clark Lakes and the Burntwood, Nelson, Odie, Grassy and Aiken
Rivers (FAR93992 barcodes 09–17, FAZ32379 barcodes 01–08) and the TCN re-runs (FAZ82303
barcodes 20–24). Other barcodes labelled Split Lake in the sequencing sheet (FAR93992 barcode08,
FBA07479) are mislabelled and are not used. FAR93992 barcodes 13–17 have no reads, and the
FAZ82303 barcodes hold only a few MB each. 12 samples are in the freshwater co-assembly
(`freshwater-coassembly-flye-nanoraw`). The Split-Lake-only danaSeq run on Grex uses
`input_split-lake` → `assembly_split-lake` → `mag_split-lake`.

Language: Swampy Cree (N-dialect). Dictionary: the Moose & Swampy Cree Conversation Manual
(atlas-ling.ca / Mushkegowuk Council, 2016, © no open licence), parsed to
`~/split-lake_inputs/dictionary_split-lake.js` (327 entries). The full Swampy Cree dictionary
(dictionary.swampycree.atlas-ling.ca) was down on 2026-11-11. Place-name spellings and live URL: not decided yet.
`env_slug`: `split-lake`.

## Withheld from the repo

| What | Where |
|---|---|
| Local sample metadata (site, date, coordinates) | `~/split-lake_inputs/metadata_split-lake.tsv` |
| Sequencing sheet | `~/Downloads/Nanopore_Record_Master(3).xlsx` |
| Co-assembly summary files | `~/split-lake_inputs/fw_viz/` (from arbutus `/data/web/microscape.app/freshwater-coassembly-flye-nanoraw/data`) |
| Cree dictionary (parsed from the PDF) | `~/split-lake_inputs/dictionary_split-lake.js`; source PDF and parse leftovers in `~/split-lake_inputs/dict_src/` |
