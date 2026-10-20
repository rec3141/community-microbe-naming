#!/usr/bin/env python3
"""Insert (or replace) one microbe in communities/<id>/{candidates,narratives,community}.js
from a JSON spec: {cand: {...}, narr: {...}, genus: {name: {...}} | null, shape: "mreBCD"}.
    add_microbe.py <community_dir> <spec.json>
"""
import json, re, sys

cdir, spec = sys.argv[1], json.load(open(sys.argv[2]))
cand, narr = spec["cand"], spec["narr"]
mid = cand["id"]
js = lambda v: json.dumps(v, ensure_ascii=False)


def obj(d, ind):
    pad = " " * ind
    lines = []
    for k, v in d.items():
        if isinstance(v, list) and v and isinstance(v[0], list):
            inner = (",\n").join(f"{pad}  {js(x)}" for x in v)
            lines.append(f"{pad}{k}: [\n{inner}\n{pad}]")
        else:
            lines.append(f"{pad}{k}: {js(v)}")
    return ",\n".join(lines)


# candidates.js: replace an existing entry with this id, else append before the closing ];
p = f"{cdir}/candidates.js"; s = open(p).read()
block = "  {\n" + obj(cand, 4) + "\n  }"
pat = re.compile(r"  \{\n    id: \"%s\".*?\n  \}" % re.escape(mid), re.S)
if pat.search(s):
    s = pat.sub(lambda m: block, s)
else:
    i = s.rstrip().rindex("];")
    s = s[:i].rstrip() + ",\n" + block + "\n];\n"
open(p, "w").write(s)

# narratives.js: NARRATIVES entry, and GENERA entry for an existing genus
p = f"{cdir}/narratives.js"; s = open(p).read()
nblock = f"  {js(mid)}: {{\n" + obj(narr, 4) + "\n  }"
pat = re.compile(r"  %s: \{\n.*?\n  \}(?=,\n  \"|\n\};)" % re.escape(js(mid)), re.S)
if pat.search(s):
    s = pat.sub(lambda m: nblock, s, count=1)
else:
    i = s.index("\n};")  # end of NARRATIVES
    s = s[:i] + ",\n" + nblock + s[i:]
for gname, g in (spec.get("genus") or {}).items():
    gblock = f"  {gname}: {{\n" + obj(g, 4) + "\n  }"
    gi = s.index("window.GENERA")
    pat = re.compile(r"  %s: \{\n.*?\n  \}" % gname, re.S)
    if pat.search(s, gi):
        s = s[:gi] + pat.sub(lambda m: gblock, s[gi:], count=1)
    else:
        i = s.rstrip().rindex("};")
        s = s[:i].rstrip() + ",\n" + gblock + "\n};\n"
open(p, "w").write(s)

# community.js: rod-shape genes
if "shape" in spec:
    p = f"{cdir}/community.js"; s = open(p).read()
    s = re.sub(r"  shapeGenes: \{\n(.*?)\n  \},",
               lambda m: "  shapeGenes: {\n" + re.sub(r",?\s*%s:'[^']*'" % re.escape(js(mid).replace('"', "'")), "", m.group(1)).rstrip(", ")
               + f", '{mid}':'{spec['shape']}',\n  }},", s, flags=re.S)
    open(p, "w").write(s)
print(f"[INFO] {mid}: added/updated")
