# Deploying a site

The site is static files plus a small PHP proxy (`api/`). It works on any shared host with PHP
7.4+ and curl, for example DreamHost. Igluligaarjuk is served from
`cryomics.org/igluligaarjuk-microbes/`, which the user reaches as the ssh host `dreamhost`.

## Steps

1. Assemble: `scripts/build/assemble_site.sh <id> [private dictionary.js]`.
2. Upload, only when the user asks:
   `scripts/build/deploy.sh <id> <ssh-host> <remote-dir> <public-url>`.
   The script stamps `?v=<epoch>` onto the data `<script>` tags, so browsers fetch fresh
   copies. It never uploads `*.py`, `.env` or `*.bak*` files.
3. API key (once per community, done by the user): on the host, create
   `~/.<env_slug>.env` with mode 600 and these variables:
   ```
   ANTHROPIC_API_KEY=...
   DAILY_LIMIT=400          # drafts per day, all visitors together (optional)
   ```
   `lib.php` looks for the file at `dirname(api/, 3)`, which is the home directory when the
   site sits at `~/<domain>/<folder>/`. Change `home_dir()` if the site sits deeper.
   Daily counts go in `~/.<env_slug>-usage/`.
4. Check: `curl <public-url>/api/status` should print `{"ok":true,"model":...}`.

When an agent works on deployment, it only reports whether the variables are present. It
never prints or copies their values.

## Local preview with drafting

`serve.py` serves the assembled folder and answers `api/status` and `api/protologue` itself.
It reads the key from `$ANTHROPIC_API_KEY`, `dist/<id>/.env` or `~/.<env_slug>.env`.
`dist/` is rebuilt on every assemble, so keep the key in the home file.

The model and prompt come from `communities/<id>/api/prompt.json`. Both `lib.php`
(`build_prompt`) and `naming_api.py` (`prompt_for`) build the user message. Change them
together.

## Batch etymologies

The Naming tab saves names, and its CSV download feeds a batch run:
`python3 dist/<id>/naming_api.py <id>_proposed_names.csv > names_with_etymology.csv`.
