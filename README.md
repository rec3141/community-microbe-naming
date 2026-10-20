# community-microbe-naming

A template for community workshops where people name newly discovered bacteria from their
own waters. Each community gets a website showing its microbes (story, family tree, where
they live, what they do). On a Naming tab, participants build Latin names from words in their
own language. The names follow the [SeqCode](https://seqco.de) rules for genomes from
environmental DNA.

The first community was **Igluligaarjuk** (Chesterfield Inlet, Nunavut), where names were built
from Inuktitut words: <https://cryomics.org/igluligaarjuk-microbes/>.

This repository is written mainly for AI coding agents that set up and run new workshops.
Start with [AGENTS.md](AGENTS.md).

| Folder | What's in it |
|---|---|
| `site/` | The shared web page (`index.html`), the naming-API proxy (`api/`, PHP) and a local server (`serve.py`, `naming_api.py`) |
| `communities/<id>/` | Everything specific to one community: settings, microbe list, stories, pictures, site data |
| `communities/_template/` | Starting point for a new community |
| `scripts/build/` | Build `site_data.js` from analysis outputs, assemble a site, deploy it |
| `scripts/hpc/` | Slurm/Apptainer helpers for read mapping, genome QC and reassembly (danaSeq containers) |
| `docs/` | Workflow, new-community checklist, data ethics, deployment |

Licence: MIT (code). Community text, pictures and data are shared for the workshop. Before
reusing them, check the community folder's README.
