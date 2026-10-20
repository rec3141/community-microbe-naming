# Adding a community

Work through these steps in order. Each step names who decides. "The user" is the
researcher you are working with; "the community" is the partner Nation, school or
organisation. The community's decisions reach you through the user.

## Before any code

1. **Agreement** (the user and the community): confirm the community has agreed to this
   workshop. Settle what may be published (place names, site names, maps, photos) and who
   holds the data. See [ethics-and-data.md](ethics-and-data.md). Do not publish a site until
   the user confirms this.
2. **Language source** (the community): choose the dictionary or word list and get permission
   to use it. Record its licence. If the licence is unclear, keep the dictionary out of the
   repo and pass it to `assemble_site.sh` from a private path.
3. **Names** (the community): agree on the place name in the community's language, its
   spelling, and the English name. Also agree on how the habitats should be described.

## Set up the folder

```bash
cp -r communities/_template communities/<id>      # id: lowercase, no spaces, e.g. split-lake
```

Then edit these files:

| File | What to fill in |
|---|---|
| `community.js` | every field. `habitats.marine: ''` hides the marine legend for an inland community |
| `build_config.json` | `inputs_dir`, `candidates`, `tree_specs`, `local.*`, a station for the community with `is_ci: true`, and a matching first rule in `station_rules` |
| `api/prompt.json` | `language`, `env_slug` (also the env file name on the host), the community sentence and the example in `system` |
| `candidates.js`, `narratives.js` | one entry per microbe; `GENERA` for each existing genus |
| `img/` | pictures; `img/PROMPTS.md` |
| `README.md` | what is withheld and where it lives (copy the Igluligaarjuk README's structure) |

Keep the regional `stations` and `station_rules` from the template. They describe the
group's whole sample collection, so every community's maps compare against the same
regions. Add a station only for new sampling areas.

## Pick microbes and build data

Follow [workflow.md](workflow.md) steps 1–5. Typical roster: 8–12 microbes from both
habitats if the community has both, spread across phyla. Each should be high quality and
have no Latin name yet.

## Write and check

- Write stories after `site_data.js` exists, and check every number and site name against it.
- Ask the user to have someone from the community read the text before the workshop.
- Assemble, preview, and test every tab ([workflow.md](workflow.md) step 7).

## Communities planned (as of October 2026)

| id (suggested) | Community | Language | Samples | Notes |
|---|---|---|---|---|
| `igluligaarjuk` | Chesterfield Inlet, NU | Inuktitut (Aivilingmiutut) | inlet + three lakes, 2025 | done; live |
| (Cree) | Split Lake area, MB (Nelson River) | Cree | Split Lake samples | freshwater only; regional station "Nelson River / Split & Assean Lakes (Northern MB)" already exists |
| (Anishinaabe) | Lake Winnipeg, MB | Anishinaabemowin | Lake Winnipeg samples | freshwater only; stations "Lake Winnipeg North/South Basin" already exist |

For these communities, ask the user for the folder id, the community's preferred names and
spellings, the dictionary source and its licence, and the local metadata TSV. Their
samples are already in the freshwater co-assembly. Split the local station out of the
regional one by putting a specific rule first in `station_rules`.
