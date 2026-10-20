#!/usr/bin/env python3
"""Draft SeqCode protologue etymologies for workshop names
with the Claude API. Used live by serve.py, or as a batch over the saved-names
CSV that the Naming tab downloads:

    python3 naming_api.py <community>_proposed_names.csv > names_with_etymology.csv

Reads ANTHROPIC_API_KEY from the environment, .env next to this file, or ~/.<env_slug>.env.
Set NAMING_MODEL to override the model.
"""
import csv, json, os, sys, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
GENDER = {"m": "masculine", "f": "feminine", "n": "neuter"}


def api_key():
    if os.environ.get("ANTHROPIC_API_KEY"):
        return os.environ["ANTHROPIC_API_KEY"]
    # .env next to this file, else ~/.<env_slug>.env (the same file the PHP proxy reads)
    slug = json.load(open(os.path.join(HERE, "api", "prompt.json"), encoding="utf-8")).get("env_slug", "microbe-naming")
    for p in (os.path.join(HERE, ".env"), os.path.expanduser(f"~/.{slug}.env")):
        if os.path.exists(p):
            for line in open(p):
                k, _, v = line.strip().partition("=")
                if k.strip() == "ANTHROPIC_API_KEY":
                    return v.strip().strip("'\"")
    raise SystemExit("[ERROR] ANTHROPIC_API_KEY not found in .env, ~/.<env_slug>.env or the environment")


# system prompt, tool schema and default model, shared with the PHP proxy in api/
PROMPT = json.load(open(os.path.join(HERE, "api", "prompt.json"), encoding="utf-8"))
MODEL = os.environ.get("NAMING_MODEL", PROMPT["model"])
LANG = PROMPT.get("language", "local-language")


def prompt_for(n):
    """User message for one name. Keep in step with build_prompt() in api/lib.php."""
    g = lambda d, k: str(d.get(k) or "")
    syl = lambda k: f" ({n[k]})" if n.get(k) else ""
    lines = [f"Proposed name: {g(n, 'name')} {g(n, 'rank')}",
             f"Genus gender: {GENDER.get(n.get('gender'), g(n, 'gender') or 'unknown')}"]
    end = lambda k: f", + ending -{g(n, k + '_ending')} ({g(n, k + '_ending_meaning')})" if n.get(k + "_ending") else ", used without an ending"
    if n.get("genus_word"):
        lines.append(f"Genus built from {LANG} '{g(n, 'genus_word')}'{syl('genus_syl')}, meaning '{g(n, 'genus_meaning')}'{end('genus')}")
    else:
        lines.append("Genus already validly named; only the species is new.")
    lines.append(f"Species epithet built from {LANG} '{g(n, 'species_word')}'{syl('species_syl')}, meaning '{g(n, 'species_meaning')}'{end('species')}")
    if n.get("edited"):
        lines.append("The spelling was edited by hand; base the etymology on the proposed name exactly as written.")
    if n.get("higher_taxa"):
        lines.append(f"New higher taxa formed from the genus: {g(n, 'higher_taxa')}")
    return "\n".join(lines)


def protologue(n, timeout=120):
    body = {
        "model": MODEL,
        "max_tokens": PROMPT["max_tokens"],
        "system": PROMPT["system"],
        "tools": [PROMPT["tool"]],
        "tool_choice": {"type": "auto"},  # forced tool choice isn't supported on every model
        "messages": [{"role": "user", "content": prompt_for(n)}],
    }
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=json.dumps(body).encode(), method="POST", headers={
        "x-api-key": api_key(), "anthropic-version": "2023-06-01", "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            res = json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"API error {e.code}: {e.read().decode(errors='replace')[:400]}") from None
    for block in res.get("content", []):
        if block.get("type") == "tool_use" and block.get("name") == "protologue":
            return block["input"]
    text = "".join(b.get("text", "") for b in res.get("content", []) if b.get("type") == "text")
    try:  # fallback: the same fields as a JSON object in the text
        return json.loads(text[text.index("{"):text.rindex("}") + 1])
    except ValueError:
        raise RuntimeError("API returned no protologue") from None


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8-sig")))
    # the CSV uses the export's column headers; map them onto the saved-name fields
    names = [dict(org=r.get("organism"), name=r.get("proposed_name"), rank=r.get("rank"), **{k: r.get(k, "") for k in (
        "gender", "edited", "genus_word", "genus_syl", "genus_meaning", "genus_ending", "genus_ending_meaning",
        "species_word", "species_syl", "species_meaning", "species_ending", "species_ending_meaning", "higher_taxa")}) for r in rows]
    print(f"[INFO] {len(names)} names, model {MODEL}", file=sys.stderr)

    def one(n):
        try:
            return protologue(n)
        except Exception as e:  # keep the batch going; report per-row
            print(f"[WARN] {n['name']}: {e}", file=sys.stderr)
            return {"etymology": "", "checks": [f"ERROR: {e}"], "suggested_name": ""}

    with ThreadPoolExecutor(4) as ex:
        out = list(ex.map(one, names))
    cols = list(rows[0].keys()) if rows else []
    extra = [c for c in ("etymology", "checks", "suggested_name") if c not in cols]
    w = csv.DictWriter(sys.stdout, fieldnames=cols + extra)
    w.writeheader()
    for r, p in zip(rows, out):
        w.writerow({**r, **{k: ("; ".join(v) if isinstance(v, list) else v) for k, v in p.items()}})


if __name__ == "__main__":
    main()
