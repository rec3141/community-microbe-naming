#!/usr/bin/env python3
"""Ask Claude to rank dictionary words for each microbe (meaning and sound), for the site and sheets.

    python3 scripts/build/suggest_words.py <id> <dictionary.js> [out.js] [--only N,N] [--one-shot]

For every microbe in communities/<id>/ this sends its description (nickname, habitat, guild, story,
functions, card fact, ecosystem points) with the community's shown word list (same filter as the
page: community.js dictionarySourceFilter, no capitalised proper or place names) and asks for 15
words ranked for a Latin name: what fits the microbe, and how the word would sound in a name.
Each returned word is checked against the list by its number, so nothing is invented.
--one-shot sends all microbes in a single request instead, so the model can spread the words around:
each microbe gets 12 words, specific ones first, and a word goes to at most 3 microbes unless it is
clearly the best fit for each.

Writes window.WORD_PICKS = {microbe id: [{roman, english, why}, ...]} to out.js (default:
word_picks_<id>.js next to the dictionary). The picks quote dictionary entries, so keep the file
with the private dictionary, out of the repo; assemble_site.sh copies it in when it is there.
Needs ANTHROPIC_API_KEY (env, or ./.env, or ~/.<env_slug>.env).
"""
import json, os, re, subprocess, sys
import anthropic

MODEL = 'claude-sonnet-5-5'
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

SYSTEM = """You help a community naming workshop in {place}. High-school students and community members \
propose Latin names for newly found microbes, built from {lang} words. For each microbe you get its \
description; choose words from the numbered {lang} word list below that would make good roots for its \
genus or species name.

Rank by two things together:
1. Meaning: the word says something true and specific about this microbe (what it does, where or when it \
lives, its shape, its story), not just something every microbe here shares.
2. Sound: the word would work inside a Latin name. Prefer words that are reasonably short, easy to say, \
and distinctive; long sentence-like verb forms are weaker unless the root is great. Affixes may be listed \
when they would combine well.

Only use words from the list, citing their numbers. Do not invent or respell words. Skip words that could \
be rude, sad or awkward in a name. Give 15 words, best first, each with a short reason (under 20 words) \
that mentions the meaning link and, where it matters, the sound.

Word list (number | word | English meaning):
{words}"""

ONE_SHOT = """Here are all {n} microbes of the workshop at once. Give each one 12 words, best first.

Keep the whole set in mind: students will see every microbe's list side by side, so variety matters. \
Prefer words that fit one microbe specifically over words that would fit almost any of them (such as \
plain 'lake', 'sea', 'sun' or common affixes). Use any one word for at most 3 microbes, unless it is \
clearly the best word for each of them. Before you answer, look over the whole set and swap repeated \
generic words for specific ones.

Microbes (number: description):
{microbes}"""

SCHEMA_ALL = {"type": "object", "additionalProperties": False, "required": ["microbes"], "properties": {
    "microbes": {"type": "array", "items": {"type": "object", "additionalProperties": False, "required": ["microbe", "picks"],
        "properties": {"microbe": {"type": "integer"}, "picks": {"type": "array", "items": {"type": "object",
            "additionalProperties": False, "required": ["n", "why"],
            "properties": {"n": {"type": "integer"}, "why": {"type": "string"}}}}}}}}}

SCHEMA = {"type": "object", "additionalProperties": False, "required": ["picks"], "properties": {
    "picks": {"type": "array", "items": {"type": "object", "additionalProperties": False,
              "required": ["n", "why"], "properties": {"n": {"type": "integer"}, "why": {"type": "string"}}}}}}

LOAD_JS = r"""
const fs = require('fs'), path = require('path'), [dir, dictPath] = process.argv.slice(1);
global.window = global;
for (const f of ['community.js', 'candidates.js', 'narratives.js', 'site_data.js']) require(path.join(dir, f));
require(path.resolve(dictPath));
require(path.join(dir, '..', '..', 'site', 'explain', 'guilds.js'));
require(path.join(dir, '..', '..', 'site', 'explain', 'services.js'));
const CM = window.COMMUNITY || {}, D = window.EXTRA_SITE_DATA, G = window.GUILD_INFO || {}, SI = window.SERVICE_INFO || {};
const dict = window.DICTIONARY || window.INUKTITUT_DICTIONARY || [];
const shown = (CM.dictionarySourceFilter ? dict.filter(e => new RegExp(CM.dictionarySourceFilter).test(e.source || '')) : dict)
  .filter(e => !/^[A-Z]/.test(e.roman || ''));
const microbes = window.CANDIDATES.map(c => { const n = Object.assign({}, c, (window.NARRATIVES || {})[c.id] || {}), g = G[n.guild] || {};
  return {id: c.id, nickname: n.nickname, habitat: c.habitat, guild: g.name ? `${g.name}: ${g.short}` : '',
    story: n.eco || n.story || '', functions: n.fn || '', fact: n.cardFact || '', tags: n.tags || [],
    ecosystem: Object.entries(n.esPoints || {}).map(([k, [h, t]]) => `${(SI[k] || {}).title || k}: ${h} - ${t}`),
    isolated: n.isolated || null}; });
process.stdout.write(JSON.stringify({place: CM.placeName || '', lang: CM.language || 'local-language',
  slug: (CM.envSlug || ''), microbes, words: shown.map(e => ({roman: e.roman, english: e.english})) }));
"""


def api_key(slug):
    if os.environ.get('ANTHROPIC_API_KEY'):
        return os.environ['ANTHROPIC_API_KEY']
    for p in ['.env', os.path.expanduser(f'~/.{slug}.env')]:
        if os.path.isfile(p):
            for line in open(p):
                m = re.match(r'\s*ANTHROPIC_API_KEY\s*=\s*(\S+)', line)
                if m:
                    return m.group(1).strip('"\'')
    sys.exit('[ERROR] no ANTHROPIC_API_KEY (env, ./.env or ~/.<env_slug>.env)')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    only = None
    if '--only' in sys.argv:
        only = {int(x) for x in sys.argv[sys.argv.index('--only') + 1].split(',')}
        args = [a for a in args if not re.fullmatch(r'[\d,]+', a)]
    if len(args) < 2:
        sys.exit(__doc__)
    cid, dict_path = args[0], os.path.abspath(args[1])
    out = os.path.abspath(args[2] if len(args) > 2 else os.path.join(os.path.dirname(dict_path), f'word_picks_{cid}.js'))
    src = os.path.join(ROOT, 'communities', cid)
    data = json.loads(subprocess.run(['node', '-e', LOAD_JS, src, dict_path], capture_output=True, text=True, check=True).stdout)
    slug = json.load(open(os.path.join(src, 'api', 'prompt.json'))).get('env_slug', cid)
    words = data['words']
    listing = '\n'.join(f"{i} | {w['roman']} | {w['english']}" for i, w in enumerate(words))
    system = [{"type": "text", "text": SYSTEM.format(place=data['place'], lang=data['lang'], words=listing),
               "cache_control": {"type": "ephemeral"}}]  # the long word list is the same for every microbe
    client = anthropic.Anthropic(api_key=api_key(slug))

    picks = {}
    if os.path.isfile(out):  # keep earlier results when re-running a few microbes with --only
        m = re.search(r'=\s*(\{.*\})\s*;?\s*$', open(out).read(), re.S)
        picks = json.loads(m.group(1)) if m else {}
    describe = lambda mb: {x: mb[x] for x in ['nickname', 'habitat', 'guild', 'story', 'functions', 'fact', 'tags', 'ecosystem', 'isolated'] if mb[x]}

    def checked(k, raw):  # word numbers -> dictionary entries; drop unknown or repeated numbers
        got, seen = [], set()
        for p in raw:
            n = p.get('n')
            if not isinstance(n, int) or not 0 <= n < len(words) or n in seen:
                print(f'[WARN] #{k}: dropped word number {n} (unknown or repeated)', file=sys.stderr)
                continue
            seen.add(n)
            got.append({'roman': words[n]['roman'], 'english': words[n]['english'], 'why': p.get('why', '').strip()})
        return got

    def save():
        with open(out, 'w') as f:  # written after every result, so a stopped run keeps what it has
            f.write('// Ranked word suggestions per microbe, from scripts/build/suggest_words.py (' + MODEL + ').\n'
                    '// Quotes the private dictionary: keep out of the repo.\n'
                    'window.WORD_PICKS = ' + json.dumps(picks, ensure_ascii=False, indent=1) + ';\n')

    if '--one-shot' in sys.argv:
        mbs = data['microbes']
        prompt = ONE_SHOT.format(n=len(mbs), microbes='\n'.join(f'{k}: ' + json.dumps(describe(mb), ensure_ascii=False) for k, mb in enumerate(mbs, 1)))
        # one long answer for every microbe: stream it so the request can't time out
        with client.messages.stream(model=MODEL, max_tokens=64000, system=system,
                                    output_config={"effort": "high", "format": {"type": "json_schema", "schema": SCHEMA_ALL}},
                                    messages=[{"role": "user", "content": prompt}]) as stream:
            resp = stream.get_final_message()
        if resp.stop_reason != 'end_turn':
            sys.exit(f'[ERROR] stopped early: {resp.stop_reason}')
        for item in json.loads(next(b.text for b in resp.content if b.type == 'text'))['microbes']:
            k = item.get('microbe')
            if not isinstance(k, int) or not 1 <= k <= len(mbs):
                print(f'[WARN] unknown microbe number {k}', file=sys.stderr)
                continue
            picks[mbs[k - 1]['id']] = checked(k, item['picks'])
        missing = [mb['nickname'] for mb in mbs if mb['id'] not in picks]
        u = resp.usage
        print(f'[INFO] one request: {u.input_tokens} in, {u.cache_read_input_tokens or 0} cached, {u.output_tokens} out; '
              f'missing: {missing or "none"}', file=sys.stderr)
        save()
        print(f'[INFO] wrote {out}', file=sys.stderr)
        return

    for k, mb in enumerate(data['microbes'], 1):
        if only and k not in only:
            continue
        desc = describe(mb)
        resp = client.messages.create(
            model=MODEL, max_tokens=8000, system=system,
            output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
            messages=[{"role": "user", "content": "Microbe:\n" + json.dumps(desc, ensure_ascii=False, indent=1)}])
        if resp.stop_reason == 'refusal':
            print(f'[WARN] #{k} {mb["nickname"]}: declined, kept old picks', file=sys.stderr)
            continue
        got = checked(k, json.loads(next(b.text for b in resp.content if b.type == 'text'))['picks'])
        picks[mb['id']] = got
        u = resp.usage
        print(f"[INFO] #{k} {mb['nickname']}: {len(got)} words ({u.input_tokens} in, {u.cache_read_input_tokens or 0} cached, "
              f"{u.output_tokens} out): {', '.join(g['roman'] for g in got[:6])}", file=sys.stderr)
        save()
    print(f'[INFO] wrote {out}', file=sys.stderr)


if __name__ == '__main__':
    main()
