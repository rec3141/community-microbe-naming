# Microbe Clash: the card game

A two-player card game built from the workshop's microbes. Every microbe becomes a card
whose HP, attacks, weakness and abilities come from its own DNA data and from where and
when it was found. It is made for high-school students at the workshop: a printed deck on
the table, or the same game on screen (`cards.html`, linked from the 🃏 button in the header
of the main page).

- 2 players, about 15 minutes (3 minutes of drafting, then 8 to 12 turns in total).
- One printed set: one card per microbe, one card per sampled place and season, and
  12 event cards (45 cards for Igluligaarjuk, 5 pages of 9), plus coins or beads.
- Nothing is typed in by hand. Cards are rebuilt from `site_data.js` and the microbe text
  every time the page loads, so new microbes (for example the two isolates still being
  processed) get a card as soon as their data is in `site_data.js`.

Files:

| File | What it holds |
|---|---|
| `site/cards/engine.js` | The rules that turn data into cards (`MicrobeCards.buildDeck`), the balance knobs (`TUNE`), event cards |
| `site/cards/game.js` | The rules engine (`MicrobeGame.Game`) and the computer player (`MicrobeGame.AI`) |
| `site/cards/rules.js` | Quick and full rules as HTML, with numbers read from `TUNE` |
| `site/cards/render.js`, `cards.css` | Card faces (63 × 88 mm), backs, the "where the numbers come from" panel |
| `site/cards/ui.js`, `play.js`, `site/cards.html` | Deck view, big view, rules, print sheets, on-screen game |
| `scripts/build/card_sim.js` | Balance simulator: `node scripts/build/card_sim.js igluligaarjuk 4000` |

All of it is shared by every community. The community folder supplies only its usual files
(`candidates.js`, `narratives.js`, `site_data.js`, `community.js`, `img/`).
`assemble_site.sh` copies `cards.html` and `site/cards/` into `dist/<id>/`.

## Quick rules (the 5-minute rules card)

**Goal.** Be the first to wash out 3 of your rival's microbes.

**Set up (about 3 minutes)**
1. Shuffle the microbe cards and lay 10 face up. Take turns picking: A, B, B, A, A, B, B, A, A, B.
   Each of you now has a team of 5.
2. Shuffle the Event cards and deal each player 3. Shuffle the Place cards and turn the top one
   face up between you.
3. Each player puts 1 microbe in front as their **Active** and up to 3 behind it as their
   **Bench**. Keep any others in your hand.
4. Flip a coin. The winner goes first but cannot attack on that very first turn.

**On your turn**
1. **Draw** 1 Event card.
2. **Feed**: put 1 nutrient (a coin, bead or bean) on one of your microbes. If the Place card
   lists that microbe, put 2.
3. You **may**: put microbes from your hand on your Bench · play 1 Event card · **retreat** once
   (take nutrients off your Active equal to its retreat cost, then swap it with a Bench microbe).
4. **Attack**: if your Active has at least as many nutrients as an attack's cost (●), do that
   damage to your rival's Active. Nutrients stay on the card. Your turn ends.

**Damage.** Weakness ×2 · Resistance −20 · Can't hurt: 0 damage · +10 if the Place's season
matches the attacker's peak season (🌸 spring, 🍁 fall).

**Washed out.** When a microbe's damage reaches its HP, it is washed out. Its owner picks a new
Active, then looks at the top 2 Place cards and puts one in play (the old Place goes to the bottom).

**Wrong water.** At the start of your turn, a lake microbe Active in a salty Place, or a sea
microbe Active in a lake, takes 10 damage. 🧂 microbes are fine in salt water.

## Full rules

**What you need.** The microbe, Place and Event cards (one printed set is enough for 2 players),
about 30 tokens for nutrients (coins, beads, beans, or the printable token sheet) and a pencil
and paper or damage tokens.

**The cards**
- **Microbe cards**: HP, a type (how it makes a living), 2 attacks, sometimes an ability, a
  weakness or resistance from its cell wall, a retreat cost, badges (☀ rhodopsin, ❄ cold-shock
  proteins, 🧂 salt protection, 🛡 CRISPR, 🔹 tiny genome), where it was found and its peak season.
- **Place cards**: a sampling site in a season. Salt or fresh water, and the microbes found there
  in that season (\* = found there, but the sample date was not recorded).
- **Event cards**: things that happen in nature: viruses, grazers, ice, long days, spills and more.

**Set up**
1. Draft: shuffle the microbe cards, lay 10 face up, pick in the order A, B, B, A, A, B, B, A, A, B.
   Put the rest away. (Short on time: deal 5 each at random.)
2. Deal 3 Event cards to each player and keep them secret. The rest is the Event pile; when it
   runs out, shuffle the used Events into a new pile.
3. Shuffle the Place cards and turn the top one face up.
4. Each player puts 1 microbe face up as their Active and up to 3 as their Bench.
5. Flip a coin for who goes first. The first player cannot attack on their first turn.

**A turn**
1. Draw the top Event card.
2. Feed once: 1 nutrient on any one of your microbes in play (2 if the Place lists it).
3. Before attacking, in any order: put microbes from your hand on your Bench (3 at most);
   play one Event card; retreat once (pay the retreat cost in nutrients from the Active, then
   swap it with a Bench microbe; damage and nutrients stay on each card).
4. Attack with your Active (optional): choose an attack whose cost is no more than the
   nutrients on the Active. Nutrients are not spent. Then your turn ends.
5. At the end of your turn, "end of your turn" abilities happen (Carbon Catcher).

**Working out damage**: start with the attack's number; +10 if the Place's season is the
attacker's peak season; add ability bonuses (Mystery Genes, Quorum Sensing); then ×2 if the
defender is weak to the attack's kind (🎯 Hunt or 🧪 Toxin), −20 if it resists it, 0 if it
can't be hurt by it.

**Washing out**: a microbe whose damage reaches its HP is set aside and the other player scores
1. Its owner picks a new Active (from the Bench, or from the hand if the Bench is empty), then
looks at the top 2 Place cards and puts one face up; the old Place and the other card go to the
bottom. This lets the player who is behind choose the next Place.

**Wrong water**: at the start of your turn, a freshwater Active in a salty Place, or a marine
Active in a lake, takes 10 damage. Lake microbes with 🧂 are not hurt in salt water.

**Winning**: first to wash out 3 rival microbes, or your rival has no microbes left.

**Fine print**: abilities work on their own. Damage to a Bench microbe (Chemotaxis Chase) still
uses weakness and resistance. Damage from Events and wrong water ignores them. If an Event makes
two microbes tie (Phage Attack), the player who played it chooses. Seed Bank sends a microbe
back to the hand with no damage and no nutrients.

## How every number is made

All rules live in `site/cards/engine.js`. The knobs are in `TUNE`; the values below are the
current ones. "Local samples" are the community's own samples (`northMap[id].ci_samples`), and
cells per litre are worked out exactly as on the Distribution tab: relab % × cells per litre for
the habitat (`cellModel`) × mean genome size / this genome's size.

### Type (lifestyle)

Checked in this order:

1. **🎯 Hunter**: GTDB phylum Bdellovibrionota, or a tag says hunter/predator.
2. **🛢️ Oil-eater**: any CANT-HYD hit in `canthyd[id]`.
3. Otherwise a score from the microbe's own text (`tags` count 3 or 2, `activities` 1) and data:
   - **⚗️ Chem-eater**: 3 × (tags mention sulfur, thiosulfate, ammonia, nitrite or methanol)
     + 1 × (activities do);
   - **🍂 Recycler**: 3 × (tags mention seaweed, alginate, laminarin, sugar, fibre, chitin,
     sulfatase, organic acid, digest) + 1 × (activities do) + 1 if it has 3+ sulfatase markers;
   - **☀️ Sun-catcher**: 2 × (tags mention sunlight, rhodopsin or solar) + 1 if it has a
     rhodopsin marker (or activities mention one).

   Highest score wins; ties go Chem-eater, then Recycler, then Sun-catcher. No clue at all:
   Recycler (it eats dissolved organic matter).

### HP: how widespread it is

HP = 60, +10 if it was found in at least 30% of local samples, +10 if it was found in at
least 20% of the other northern samples (Hudson Bay, Churchill, High Arctic), +10 if its genome
is 4 Mbp or more. Range 60 to 90. Science: a microbe found in many samples and places is hard
to wipe out.

### Bloom tier: how big it gets

Bloom tier from its biggest local count (cells per litre): 0 under 5 million, 1 under
20 million, 2 under 60 million, 3 above. Science: microbes that reach big numbers hit harder.

| Bloom tier | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Quick attack damage | 10 | 10 | 20 | 20 |
| Big attack damage | 40 | 50 | 60 | 70 |
| Big attack cost | 2 ● | 2 ● | 3 ● | 3 ● |

Hunters share one big attack, Break-In: 40 damage for 2 ●, which becomes 80 against the
Gram-negative cells they really can attack.

### Attacks: named after genes the microbe has

**Big attack** (the type's signature, using the most specific gene found in its tags, then
activities, then Function text):

| Type | Attack | Evidence |
|---|---|---|
| Hunter | Break-In (🎯 Hunt) | Bdellovibrionota: periplasmic predators |
| Oil-eater | `<gene>` Oil Crack | first CANT-HYD model, e.g. CYP153 |
| Chem-eater | Amo Ammonia Burn / Nxr Nitrite Burn / XoxF Methanol Munch / Sox (or Dsr) Sulfur Burn | first of ammonia, nitrite, methanol, sulfur in its text; Sox from the marker or text, Dsr from text |
| Recycler | Alginate Lyase Slice / Laminarinase Feast / Chitin Chomp / Sulfatase Strip / Organic Acid Sweep / `<top GH>` Sugar Cut | first match in its text, else its most common CAZy GH/PL marker |
| Sun-catcher | Rhodopsin Surge | rhodopsin marker |

**Quick attack** (cost 1), first that applies:
1. Hunter: **Chemotaxis Chase** (🎯, 10, may hit a Bench microbe): hunters smell their way to prey.
2. A toxin gene cluster (antiSMASH marker), first of: lanthipeptide → Lanthipeptide Zap,
   hydrogen-cyanide → Cyanide Puff, betalactone → Betalactone Blast, NRPS → NRPS Brew, T1PKS →
   Polyketide Potion, RiPP → Bacteriocin Shot, NAPAA → Poly-Lysine Lash (🧪 Toxin).
3. Not a Sun-catcher but has a rhodopsin: **Light Pump** (10, +1 nutrient on itself).
4. Glides or swims (text): **Glide Away / Dash Away** (may switch to the Bench for free).
5. A Sun-catcher without a toxin: Light Pump.
6. Otherwise **TCA Cycle Spin** (plain metabolism).

### Cell wall: weakness and resistance

| Cell wall (from GTDB) | Weakness | Resistance |
|---|---|---|
| Gram-negative (default) | 🎯 Hunt ×2 | none |
| Hunters (Bdellovibrionota) | none (hunters don't hunt each other in this game) | none |
| Gram-positive (Actinomycetota, Bacillota, Chloroflexota) | 🧪 Toxin ×2 | 🎯 Hunt can't hurt |
| Waxy coat (text mentions mycolic acids or a waxy coat) | none | 🎯 can't hurt, 🧪 −20 |
| Archaea (domain) | none | 🎯 can't hurt, 🧪 −20 |

Science: bacteria-hunters invade the gap between the two membranes of Gram-negative cells, so
they cannot use Gram-positive bacteria or archaea as prey. Many natural antibiotics
(lanthipeptides for example) work best on Gram-positive cells, which lack the outer membrane.

### Ability (at most one), first that applies

| Ability | When | What it does | Science |
|---|---|---|---|
| Burst Out | Hunter | heals fully when it washes out a rival | grows inside its prey and bursts out |
| Mystery Genes | `hypo_pct` ≥ 60% | coin flip on attack: heads +20 | most of its genes have unknown jobs |
| Quorum Sensing | homoserine-lactone BGC | +10 with 2+ on the Bench | bacteria count neighbours with signals |
| Carbon Catcher | RuBisCO marker or text | heals 10 at the end of your turn | makes its own food from CO₂ |
| Vitamin Share | 2+ B12 markers, B12 module ≥ 0.6, or "vitamin" in its text | feeding it also heals 10 on one of yours | B-vitamin makers support neighbours |
| Hold Fast | text mentions sticking/attachment | Tide Turns can't move it (retreat 2) | sticky surface proteins |

### Retreat, badges, home and season

- **Retreat cost**: 0 if its text says it swims or glides, 2 with Hold Fast, else 1.
- **Badges** (used by events): ☀ rhodopsin marker or text; ❄ cold-shock protein marker;
  🧂 osmoprotectant marker or glycine betaine in text; 🛡 CRISPR-Cas marker; 🔹 genome under 1.5 Mbp.
- **Found at**: every local site where it was detected, with the seasons (May = 🌸 spring,
  Sept and Oct = 🍁 fall; no date = \*).
- **Peak season**: the season of its biggest dated count. Hunters were only found in undated
  samples, so they have no peak season.
- **Science line**: the first sentence of its big attack's explanation (or its type's), plus its
  biggest count with place and month.

### Places and events

Place cards: one per site × season that was sampled with a date (`ciSites` and dated
`ci_samples`), kept only if at least 2 microbes were found there in that season. Home microbes
are those detected there in that season (or there with no date, marked \*). Spring places boost
🌸 microbes and fall places 🍁 microbes by +10 damage.

Event cards are the same for every community:

| Event | Effect | Science |
|---|---|---|
| Phage Attack | the microbe in play with the most HP left takes 30 (🛡 −10) | "kill the winner": viruses spread fastest through the commonest microbe |
| Hungry Grazer | 30 to the rival Active; 🔹 tiny microbes take none | protist grazers miss very small cells |
| Freeze-Up | Actives without ❄ take 20 | cold-shock proteins keep RNA working near 0 °C |
| Long Days | +1 nutrient on up to 2 of your ☀ microbes | long northern spring days |
| Algae Bloom | +2 nutrients on a Recycler (else +1) | sugar-eaters bloom after algae |
| Mud Stir-Up | +2 nutrients on a Chem-eater (else +1) | mixing releases ammonium and sulfur compounds |
| Fuel Spill | +2 on each of your Oil-eaters; non-oil Actives take 10 | fuel is toxic, but oil-eaters bloom |
| Tide Turns | swap the rival Active with a Bench microbe | tides move microbes around |
| Gene Swap | your Active may use a Bench microbe's attack | horizontal gene transfer |
| Vitamin Gift | heal 30 | shared B vitamins |
| Seed Bank | return a microbe to your hand, fully healed | dormant microbes wait for better times |
| Field Trip | choose the next Place from the top 3 | where and when you sample changes what you find |

### The Igluligaarjuk deck today (generated, for reference)

| # | Microbe | Type | HP | Quick attack | Big attack | Ability | Weak / resist | Retreat | Badges | Peak |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Tidal Thioglobus | Chem-eater | 60 | TCA Cycle Spin (1●, 20) | Sox Sulfur Burn (3●, 60) | Carbon Catcher | weak Hunt ×2 | 1 | ❄🧂🛡🔹 | spring |
| 2 | Peckish Polaribacter | Recycler | 60 | Light Pump (1●, 10) | Alginate Lyase Slice (2●, 50) | — | weak Hunt ×2 | 1 | ☀❄🛡 | spring |
| 3 | Snow-Surfing Schleifer | Recycler | 60 | Light Pump (1●, 10) | Laminarinase Feast (2●, 50) | Vitamin Share | weak Hunt ×2 | 1 | ☀❄🛡 | spring |
| 4 | Gutsy Gamma | Chem-eater | 60 | Light Pump (1●, 10) | Dsr Sulfur Burn (2●, 40) | Vitamin Share | weak Hunt ×2 | 1 | ☀❄🛡🔹 | fall |
| 5 | Busy Balneatrix | Chem-eater | 60 | Cyanide Puff 🧪 (1●, 10) | Sox Sulfur Burn (2●, 50) | Vitamin Share | weak Hunt ×2 | 1 | ☀❄🧂🛡 | spring |
| 6 | Methanol-Munching Methylophilid | Chem-eater | 80 | Lanthipeptide Zap 🧪 (1●, 10) | XoxF Methanol Munch (2●, 50) | Vitamin Share | weak Hunt ×2 | 1 | ☀🛡🔹 | fall |
| 7 | Fibre-Feasting Ferruginibacter | Recycler | 60 | Glide Away (1●, 10) | Chitin Chomp (2●, 40) | — | weak Hunt ×2 | 0 |  | fall |
| 8 | Persistent Polynucleobacter | Recycler | 70 | Betalactone Blast 🧪 (1●, 10) | Organic Acid Sweep (2●, 50) | Vitamin Share | weak Hunt ×2 | 1 | 🛡 | fall |
| 9 | Northern Nitrotoga | Chem-eater | 60 | TCA Cycle Spin (1●, 10) | Nxr Nitrite Burn (2●, 40) | Carbon Catcher | weak Hunt ×2 | 1 | 🛡🔹 | spring |
| 10 | Pint-sized Planktophila | Sun-catcher | 70 | Cyanide Puff 🧪 (1●, 20) | Rhodopsin Surge (3●, 70) | Vitamin Share | weak Toxin ×2; Hunt 0 | 1 | ☀❄🛡🔹 | fall |
| 11 | Sun-sipping Amylibacter | Chem-eater | 70 | Light Pump (1●, 10) | Sox Sulfur Burn (3●, 60) | Vitamin Share | weak Hunt ×2 | 1 | ☀🧂🛡 | fall |
| 12 | Arcane Armatimonad | Sun-catcher | 80 | NRPS Brew 🧪 (1●, 20) | Rhodopsin Surge (3●, 70) | Mystery Genes | weak Hunt ×2 | 1 | ☀🛡 | fall |
| 13 | Prowling Peredibacter | Hunter | 70 | Chemotaxis Chase 🎯 (1●, 10) | Break-In 🎯 (2●, 40) | Burst Out | — | 0 | 🧂🛡 | — |
| 14 | Bullet-fast Bdellovibrio | Hunter | 70 | Chemotaxis Chase 🎯 (1●, 10) | Break-In 🎯 (2●, 40) | Burst Out | — | 0 | ❄🧂🛡 | — |
| 15 | Bold Bacteriovoracid | Hunter | 60 | Chemotaxis Chase 🎯 (1●, 10) | Break-In 🎯 (2●, 40) | Burst Out | — | 0 | 🛡 | — |
| 16 | Pan-Arctic Pseudothioglobus | Sun-catcher | 80 | Light Pump (1●, 10) | Rhodopsin Surge (3●, 60) | Carbon Catcher | weak Hunt ×2 | 1 | ☀❄🧂🛡 | fall |
| 17 | Munching Marimicrobium | Oil-eater | 80 | NRPS Brew 🧪 (1●, 20) | CYP153 Oil Crack (3●, 60) | Vitamin Share | weak Hunt ×2 | 1 | ☀❄🧂🛡 | fall |
| 18 | Paddling Pseudohongiellid | Oil-eater | 70 | Light Pump (1●, 10) | CYP153 Oil Crack (2●, 50) | — | weak Hunt ×2 | 0 | ☀❄🛡 | fall |
| 19 | Frond-Slicing Flavo | Recycler | 70 | Light Pump (1●, 10) | Alginate Lyase Slice (2●, 50) | — | weak Hunt ×2 | 0 | ☀❄🛡 | fall |
| 20 | Baffling Bacteroid | Sun-catcher | 80 | Glide Away (1●, 10) | Rhodopsin Surge (2●, 50) | Mystery Genes | weak Hunt ×2 | 0 | ☀❄🛡 | spring |
| 21 | Nano Nitrosopumilus | Chem-eater | 60 | TCA Cycle Spin (1●, 20) | Amo Ammonia Burn (3●, 60) | Carbon Catcher | Hunt 0; Toxin −20 | 1 | ❄🛡🔹 | spring |
| 22 | Plentiful Planctomycete | Sun-catcher | 80 | NRPS Brew 🧪 (1●, 20) | Rhodopsin Surge (3●, 70) | Mystery Genes | weak Hunt ×2 | 1 | ☀🛡 | fall |
| 23 | Mantled Mycobacterium | Sun-catcher | 60 | Betalactone Blast 🧪 (1●, 20) | Rhodopsin Surge (3●, 60) | Carbon Catcher | Hunt 0; Toxin −20 | 1 | ☀❄🛡 | fall |
| 24 | Abundant Actino | Sun-catcher | 60 | Betalactone Blast 🧪 (1●, 20) | Rhodopsin Surge (3●, 70) | Carbon Catcher | weak Toxin ×2; Hunt 0 | 1 | ☀❄🧂🛡🔹 | fall |

Places: Dock (spring, fall), Itivia (spring, fall), Tuktuttaa (spring), 1st Lake (fall),
2nd Lake (fall), 3rd Lake (spring, fall). 1st Lake in spring is left out: no microbe has a dated
spring detection there.

## Balance: playtests and what changed

The simulator (`scripts/build/card_sim.js`) builds the deck exactly as the page does and plays
thousands of games between computer players that use the same rules engine as the on-screen
game. The computer player is greedy: it feeds its Active until it can use its big attack,
then pre-feeds the Bench, plays the most useful event, retreats a microbe that is about to
be washed out, swaps in a hunt-proof microbe against a Hunter, and attacks with whatever does
the most damage (or washes out). It drafts by card value plus counter-picks. "Turns" counts
both players' turns.

What we checked: game length and that games end; first-player edge; each card's win rate when
it is on a random team (its own strength) and when drafted; each type; one-trick teams (all
hunters, all hunt-proof cells, all marine, all freshwater, highest HP); and strategy match-ups.

### Iterations

| Version | Change | Median turns | Card win rates | Types | Notes |
|---|---|---|---|---|---|
| 1 | HP 40 + 10 per spread point (0–4), big attack 30/40/50/50, tiny genomes 1 ● cheaper, hunters 40 for 3 ●, spring boosts Sun-catchers and fall boosts Recyclers | 9 | 41–64% (sd 6.4) | Sun 55, Oil 55, Hunter 44 | many one-hit wash-outs; HP-40 cards and hunters weak; Marimicrobium (HP 80) strong |
| 2 | HP base 50 | 11 | 38–65% (sd 7.0) | Sun 56 | longer but less even: the HP gaps mattered more |
| 3 | HP base 60, at most 2 spread points (30% local, 20% regional), big attack 40/50/60/70, hunters 2 ●, no tiny discount | 9 | 41–59% (sd 4.7) | 45–53 | tiny discount had made Methylophilid a 1 ● 40-damage card |
| 4 | season boost by each microbe's **peak season** from the data, not by type | 9 | 42–61% (sd 4.5) | 47–56 | the data showed most Sun-catchers peak in fall, so "spring = sun" was not true |
| final | AI and text fixes (Tide Turns heuristic) | 9 | 43–59% random teams, 45–55% drafted | 46–54 | see below |

Other things tried: quick attacks of 20 to 30 damage (a team that only uses quick attacks still
loses 97–99%, so the big attacks stay the main plan, and quick attacks were left at 10–20);
banning each event in turn for one player (each event is worth 2 to 6 points of win rate to
whoever can play it; none dominates; the computer was misusing Tide Turns, now fixed).

### Final results (4,000 games each)

```
random teams, greedy play
  first player wins 49.3% of decided games; unfinished after 80 turns 0.0%
  quick attacks are 34.9% of all attacks
  the player who lost the first microbe still won 31.5% of games
  turns per game: median 9, 10th pct 7, 90th pct 12
  by type: Oil-eater 54.4%, Sun-catcher 52.9%, Hunter 52.9%, Recycler 47.4%, Chem-eater 46.5%
  by card: Baffling Bacteroid 58.5%, Munching Marimicrobium 58.4%, Pan-Arctic Pseudothioglobus 55.1%,
           ... Tidal Thioglobus 44.4%, Peckish Polaribacter 43.7%, Northern Nitrotoga 42.6%
greedy draft, greedy play
  first player 47.8%; median 9 turns; card win rates 44.8% to 55.0%; types 48.7% to 54.0%
greedy player vs random player ................................ 98.2% (skill matters)
greedy drafter vs random drafter, both play greedy .............. 67.8% (drafting matters)
plays events vs never plays events ............................. 82.3%
greedy vs only ever uses the quick attack ...................... 99.8%
greedy vs only ever feeds its Active ........................... 54.0% (both plans work)
3 hunters + 2 random vs random team ............................ 47.6%
all hunt-proof cells (Gram-positive, waxy, archaea) vs random .. 44.2%
all marine vs random 50.0% · all freshwater vs random 47.3% · top-HP team vs random 50.4%
```

What this means:
- **No dominant card or type.** The strongest card wins 58–59% of the games it is in with a
  random team and 55% when drafted; the weakest 43% and 45%. In a draft, stronger cards get
  picked first, which evens things out.
- **No dominant strategy.** Stacking hunters is countered by hunt-proof Gram-positives and the
  reverse; feeding only the Active or spreading nutrients both work; events and good drafting
  matter, as they should in a game about choices.
- **Games end**: none lasted 80 turns. With 5 microbes and 3 wash-outs to win, and nutrients
  that stay on cards, the damage per turn keeps rising, so stalling with heals cannot last.
- **Length**: a median of 9 turns (7 to 12) is 4 or 5 turns each, about 10 minutes at a minute
  a turn, plus the draft: close to the 15-minute target. The player who loses the first microbe
  still wins about 30% of the time, partly because they pick the next Place.

To rebalance after adding microbes: `node scripts/build/card_sim.js <id> 4000`, then adjust `TUNE`
in `engine.js` (and update this page).

## Science notes and simplifications

Each mechanic stands for something real:
- Feeding and keeping nutrients: microbes grow on the food they take in; home microbes (found
  at that Place in that season) get more.
- Wrong water: salt shock for lake microbes in the sea and the reverse; glycine betaine-type
  osmoprotectants (🧂) help.
- Weakness and resistance: the hunters' periplasmic lifestyle needs a Gram-negative outer
  membrane; toxins and Gram-positive walls.
- Kill the winner, size-selective grazing, cold shock, long spring days, algae blooms, horizontal
  gene transfer, seed banks: one event each.
- Peak season and home places are straight from the samples.

Simplifications that teachers should know about:
- "Damage" is shorthand for losing ground to rivals: being outgrown, eaten, poisoned or infected.
- A toxin gene cluster is something a microbe *can* make; we have not shown that it does.
- Hunters don't hunt each other in the game; in nature they mostly prey on other kinds of bacteria.
- Gram stain is taken from the phylum (Planctomycetota and Armatimonadota count as Gram-negative).

## Open questions

- Not yet playtested with students; the timing (about 15 minutes) comes from the simulator and a
  guess of one minute per turn.
- A microbe added to `candidates.js` before its data is in `site_data.js` is left out of the
  deck (the deck page lists it as waiting for data).
- Emoji icons depend on the printing computer's fonts.
