# Igluligaarjuk (Chesterfield Inlet, Nunavut)

The first workshop: nine bacteria from the inlet (harbour, Itivia, Tuktuttaa) and the lakes
behind town (1st, 2nd and 3rd Lake), sampled in May, September and October 2025. Names are
built from Inuktitut words (Aivilingmiutut dialect).

Live site: <https://cryomics.org/igluligaarjuk-microbes/> (`env_slug`: `igluligaarjuk`).

## Withheld from this repo

| Item | Why | Where |
|---|---|---|
| `dictionary.js` (Inuktitut word list, ~1,700 entries, mostly from Inuktut Tusaalanga) | redistribution licence not confirmed | the user's machine; pass to `assemble_site.sh igluligaarjuk <path>` |
| Local sample metadata (`metadata_2026-10-20.tsv`) | names a sampler; exact coordinates | the user's machine and the cluster (`LOCAL_META`) |
| Sample sheet (`Nanopore_Record_Master*.xlsx`) | the group's whole sample register | the user's machine |
| Analysis outputs (`inputs_dir`) | large; regenerable with danaSeq | the user's machine |

`site_data.js` is the published build: site-level coordinates, sample ids, dates and abundances.

## Status (October 2026)

- On the site: 9 microbes (6 marine, 3 freshwater). See `candidates.js`.
- Waiting to be added: a *Planktophila* reassembled from community-only lake bins
  (`img/microbe_A2_planktophila.png` is ready). It is found almost only in the Chesterfield lakes.
- Planned genome swaps: reassemblies of the Polaribacter, Methylophilid, Polynucleobacter and Nitrotoga genomes (microbes 2, 6, 8, 9), which gained rRNA/tRNA genes or completeness.
- Planned roster widening: one microbe per under-represented lineage
  (`scripts/hpc/examples/ci_lineage_qc.sh`).
