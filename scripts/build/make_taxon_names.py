#!/usr/bin/env python3
"""Write taxon_names.js: the Latin genus, family and order names in a GTDB release, used by
the Naming tab to warn when a proposed genus (or the family/order built from it) exists.

    python3 make_taxon_names.py gtdb_taxonomy.tsv > site/taxon_names.js

Input: GTDB-Tk's taxonomy/gtdb_taxonomy.tsv (genome<TAB>d__;p__;...;s__), or any text with
one or more rank tokens (g__Name, f__Name, o__Name) per line, separated by ';' or tabs.
Alphanumeric placeholders (UBA845, 0-14-0-10-38-17) are dropped and lettered splits
(Thioglobus_A) count as the plain Latin name.
"""
import json, re, sys

RELEASE = "r232"
names = {"g": set(), "f": set(), "o": set()}
for line in open(sys.argv[1], encoding="utf-8"):
    for tok in re.split(r"[;\t]", line.strip()):
        tok = tok.strip()
        if len(tok) > 3 and tok[0] in names and tok[1:3] == "__":
            n = re.sub(r"_[A-Z]+$", "", tok[3:])
            if re.fullmatch(r"[A-Z][a-z]+", n):
                names[tok[0]].add(n)
print(f"// Latin genus, family and order names in GTDB {RELEASE} (alphanumeric placeholders and _A/_B suffixes removed).")
print("// Used to warn when a proposed genus (or the family/order built from it) already exists.")
print("window.TAXON_NAMES = " + json.dumps({k: " ".join(sorted(v)) for k, v in names.items()}, ensure_ascii=False) + ";")
