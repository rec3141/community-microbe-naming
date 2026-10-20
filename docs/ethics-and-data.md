# Ethics, consent and data

These workshops happen with First Nations, Inuit and Métis communities. The microbes come from
their lands and waters. The names come from their languages. Treat everything here as shared
with the community, not owned by the project.

## Principles

- **CARE principles for Indigenous data governance**: Collective benefit, Authority to
  control, Responsibility, Ethics (<https://www.gida-global.org/care>). In Inuit Nunangat,
  also follow the National Inuit Strategy on Research. With First Nations, follow
  OCAP® (Ownership, Control, Access, Possession).
- **The community decides** what is published, how places and words are spelled, which
  names go forward to the SeqCode registry, and how the community is credited. An agent
  never makes these decisions. When something is unclear, stop and ask the user.
- **Benefit returns to the community**: the site, the pictures and the names are for the
  community first. Their text is written for their students.

## What is never committed or uploaded

| Data | Why | Where it lives instead |
|---|---|---|
| Raw sample metadata (sampler names, exact private coordinates, station notes) | personal information; private sites | the user's machine and the cluster (`LOCAL_META`), outside the repo |
| The group's sample sheet (xlsx) | other projects' and people's data | the user's machine |
| Dictionaries whose licence has not been confirmed for redistribution | the language belongs to its speakers and publishers | a private path passed to `assemble_site.sh` |
| API keys, `.env` files | security | `~/.<env_slug>.env` on the host; `.env` locally |
| Proposed names from workshops | the participants' work, not yet agreed for release | the CSV downloads, held by the user |

Before every commit, run `git status` and `git diff --cached --stat`. Check for `.tsv`,
`.xlsx`, `.env` and dictionary files, and for personal names in anything new.

## What the published site contains

- Site-level coordinates for the community's sampling places (lakes, harbour) and regional
  station centroids. Publish only what the community agreed to show. If a site is sensitive
  (a harvesting spot, a private cabin lake), drop or blur its coordinates in `site_names` /
  `ciSites` before building.
- Sample ids (`FLOWCELL_barcodeNN`, station ids such as `CDIT2`), dates and abundances.
  These carry no personal information.
- The words the dictionary contains, when its licence allows display. Show the credit
  (`dictionaryCreditHtml`) whenever a dictionary is used.

## Names and the SeqCode

- A name is proposed only when the community agrees to it. Registration (SeqCode registry or
  a paper's protologue) needs the community's consent and credit, as they choose.
- The etymology must give the word, its language and its meaning, as the community gives it.
  The Claude draft (`api/protologue`) is a starting point for a taxonomist to check, not an
  authority on the language.
- Don't invent words in the community's language, or translate English words into it
  yourself. Use only the community's dictionary and the words participants supply.

## Pictures

The microbe cartoons are made with image models. Each prompt is recorded in `img/PROMPTS.md`.
Keep them cell-like and accurate to the cell's shape where known (the `shapeGenes` hints). Do
not use cultural imagery (clothing, symbols, art styles) unless the community asked for it.
