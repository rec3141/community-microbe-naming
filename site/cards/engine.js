// Microbe card game: turns a community's data into playing cards. Shared by every community.
// Every number and attack name comes from a fixed rule over site_data.js (window.EXTRA_SITE_DATA)
// and the microbe's own text (candidates.js tags/activities, narratives.js fn), so the cards
// rebuild themselves when microbes are added or the data changes. The rules are documented
// in docs/card_game.md; change TUNE (and re-run scripts/build/card_sim.js) to rebalance.
//   const deck = MicrobeCards.buildDeck({candidates, narratives, data, community})
//   -> {microbes: [...], places: [...], events: [...]}
(function (root) {
'use strict';

// ---------- balance knobs (see docs/card_game.md, "Balance") ----------
const TUNE = {
  hpBase: 60,            // every microbe starts with this many HP
  hpPerSpread: 10,       // + per spread point (how widely it was found)
  hpBigGenome: 10,       // + for a genome of 4 Mbp or more
  bigGenomeMbp: 4,
  bloomCuts: [5e6, 2e7, 6e7],   // cells per litre: bloom tier 0 | 1 | 2 | 3
  a1Dmg: [10, 10, 20, 20],      // quick attack damage by bloom tier
  a2Dmg: [40, 50, 60, 70],      // big attack damage by bloom tier
  a2Cost: [2, 2, 3, 3],         // big attack cost by bloom tier
  tinyMbp: 1.5,                 // under this many Mbp: 🔹 tiny badge (grazers miss it)
  tinyDiscount: 0,              // big-attack discount for tiny genomes (tested at 1: too strong)
  hunterA2: 40, hunterCost: 2,  // Hunters' big attack (before weakness) and its cost
  spreadCap: 4,                 // most spread points a microbe can have (the cuts below give at most 2)
  healFix: 10,                  // Carbon Catcher heal per turn
  weakMult: 2, resist: 20,
  mysteryPct: 60,               // % unknown genes for the Mystery Genes ability
  spreadLocal: [0.3],           // found in at least this share of local samples: +1 spread point
  spreadRegion: [0.2],          // found in at least this share of other northern samples: +1
  seasonBonus: 10,
  teamSize: 5, benchMax: 3, winScore: 3, handStart: 3,
};

// ---------- lifestyles (card "types") ----------
// One per functional guild (site/explain/guilds.js); a microbe's `guild` sets its type.
// Icon, colour and text come from GUILD_INFO when it is loaded; these are the fallbacks.
const GUILD_INFO = root.GUILD_INFO || {};
const LIFESTYLES = {
  chem:     {guild: 'peppy-preppers',        name: 'Peppy Prepper',        plural: 'Peppy Preppers',        icon: '🎒', color: '#f472b6',
    text: 'Makes its own food from chemicals, even in the dark.'},
  recycler: {guild: 'voracious-vegetarians', name: 'Voracious Vegetarian', plural: 'Voracious Vegetarians', icon: '🥬', color: '#34d399',
    text: 'Eats the tough sugars of seaweed, algae and plants.'},
  hunter:   {guild: 'happy-hunters',         name: 'Happy Hunter',         plural: 'Happy Hunters',         icon: '🎯', color: '#f87171',
    text: 'Hunts and eats other bacteria.'},
  sun:      {guild: 'sunny-scavengers',      name: 'Sunny Scavenger',      plural: 'Sunny Scavengers',      icon: '☀️', color: '#fbbf24',
    text: 'Sips small bits of food and tops up with sunlight.'},
  oil:      {guild: 'dumpster-divers',       name: 'Dumpster Diver',       plural: 'Dumpster Divers',       icon: '🗑️', color: '#a78bfa',
    text: 'Lives on what others leave behind.'},
};
Object.values(LIFESTYLES).forEach(L => { const g = GUILD_INFO[L.guild]; if (g) Object.assign(L, {icon: g.icon, color: g.color}); });
const LIFE_OF_GUILD = Object.fromEntries(Object.entries(LIFESTYLES).map(([k, L]) => [L.guild, k]));
// what an attack does to whom (weakness / resistance)
const KINDS = {
  grow:  {name: 'Outgrow', icon: '🍽️', text: 'Wins the race for food or light.'},
  hunt:  {name: 'Hunt',    icon: '🎯', text: 'Attacks another cell directly.'},
  toxin: {name: 'Toxin',   icon: '🧪', text: 'Releases a molecule that harms other microbes.'},
};
// trait badges used by event cards
const BADGES = {
  sun:   {icon: '☀', name: 'Rhodopsin', text: 'has a light-catching rhodopsin pump'},
  cold:  {icon: '❄', name: 'Cold-shock', text: 'has cold-shock proteins that keep it working near 0°C'},
  salt:  {icon: '🧂', name: 'Salt-proof', text: 'makes or pumps in glycine betaine-type salt protectors'},
  crispr:{icon: '🛡', name: 'CRISPR', text: 'has a CRISPR-Cas immune system against viruses'},
  tiny:  {icon: '🔹', name: 'Tiny', text: 'has a tiny genome (under 1.5 million letters), so it is probably a very small cell'},
  oil:   {icon: '🛢', name: 'Oil gene', text: 'has a gene for breaking down oil'},
};
// cell envelope -> weakness / resistance
const ENVELOPES = {
  negative: {name: 'Gram-negative', weak: 'hunt', resist: null, immune: [],
    text: 'Two membranes. Bacteria-hunters can break into the gap between them.'},
  hunter:   {name: 'Gram-negative hunter', weak: null, resist: null, immune: [],
    text: 'A bacteria-hunter with two membranes, like most of its prey. In this game, hunters do not hunt each other.'},
  positive: {name: 'Gram-positive', weak: 'toxin', resist: null, immune: ['hunt'],
    text: 'One membrane under a thick wall. Hunters cannot get in, but many natural antibiotics work best on this kind of cell.'},
  waxy:     {name: 'Waxy coat', weak: null, resist: 'toxin', immune: ['hunt'],
    text: 'A thick waxy coat keeps hunters out and slows down many antibiotics.'},
  archaea:  {name: 'Archaeon', weak: null, resist: 'toxin', immune: ['hunt'],
    text: 'Not a bacterium. Bacteria-hunters cannot use it as prey, and most bacterial antibiotics miss its different wall and membranes.'},
};
const GRAM_POSITIVE_PHYLA = /^(Actinomycetota|Bacillota|Firmicutes|Chloroflexota)/;

// ---------- attack templates ----------
// each: name(f) -> card name, kind, effect, why(f) -> one-line real-science note
const SULFUR_GENE = f => f.markers['Sox (Sulfur Ox)'] || /\bSox\b/.test(f.text.all) ? 'Sox' : /\bDsr\b/.test(f.text.all) ? 'Dsr' : '';
const SIG = {  // big attack, one per lifestyle (chem/recycler pick the best-supported sub-trait)
  hunter:  {name: () => 'Break-In', kind: 'hunt',
    why: () => 'Bacteria-hunters in this group squeeze into the gap between a prey cell\u2019s two membranes and eat it from the inside.'},
  oil:     {name: f => `${f.canthyd[0] || 'Alkane'} Oil Crack`, kind: 'grow',
    why: f => `Its ${f.canthyd[0] || 'alkane'} enzyme adds oxygen to oily alkane chains so the cell can eat them, like bacteria that bloom after oil spills.`},
  ammonia: {name: () => 'Amo Ammonia Burn', kind: 'grow',
    why: () => 'Its ammonia monooxygenase (AmoA, B, C) turns ammonia into nitrite to make energy, the first step of nitrification.'},
  nitrite: {name: () => 'Nxr Nitrite Burn', kind: 'grow',
    why: () => 'Its nitrite oxidoreductase (Nxr) turns nitrite, which is harmful to fish, into nitrate and keeps the energy.'},
  methanol:{name: () => 'XoxF Methanol Munch', kind: 'grow',
    why: () => 'Its XoxF methanol dehydrogenase lets it live on methanol, a one-carbon leftover released by algae.'},
  sulfur:  {name: f => `${SULFUR_GENE(f) ? SULFUR_GENE(f) + ' ' : ''}Sulfur Burn`, kind: 'grow',
    why: f => `${SULFUR_GENE(f) ? `Its ${SULFUR_GENE(f)} genes pull` : 'It pulls'} energy out of sulfur compounds like thiosulfate, turning them into harmless sulfate.`},
  alginate:{name: () => 'Alginate Lyase Slice', kind: 'grow',
    why: () => 'Alginate lyases cut alginate, the slimy sugar that makes kelp and other brown seaweeds bendy, into bite-size food.'},
  laminarin:{name: () => 'Laminarinase Feast', kind: 'grow',
    why: () => 'Laminarinases cut laminarin, the sugar algae store their food in, so this microbe feasts when algae bloom.'},
  sulfatase:{name: () => 'Sulfatase Strip', kind: 'grow',
    why: () => 'It has many sulfatases, enzymes that cut sulfate tags off algal sugars so they can be eaten.'},
  chitin:  {name: () => 'Chitin Chomp', kind: 'grow',
    why: () => 'Its sugar-cutting enzymes break down chitin and plant fibres, tough materials from shells, insects and tundra plants.'},
  organic: {name: () => 'Organic Acid Sweep', kind: 'grow',
    why: () => 'More than 20 transporters let it sweep up small organic acids washed into lakes from the tundra.'},
  sugar:   {name: f => `${f.topGH || 'Glycoside Hydrolase'} Sugar Cut`, kind: 'grow',
    why: f => `Its sugar-cutting enzymes${f.topGH ? ` (like ${f.topGH})` : ''} break long sugar chains into food.`},
  metal:   {name: () => 'Mtr Rust Breath', kind: 'grow',
    why: () => 'Its MtrA, MtrB and MtrC proteins pass electrons out through its cell wall to rusty iron, so it can breathe metal when oxygen runs out.'},
  leftovers:{name: () => 'Leftover Feast', kind: 'grow',
    why: () => 'It takes in many kinds of small molecules, so it can live on what other microbes leave behind.'},
  sun:     {name: () => 'Rhodopsin Surge', kind: 'grow',
    why: () => 'A rhodopsin light pump charges the cell like a tiny solar panel, giving it extra energy on top of its food.'},
};
// specific chem / recycler sub-traits, checked in this order in tags, then activities, then the Function text
const CHEM_TRAITS = [['ammonia', /ammonia|\bamo[ABC]?\b/i], ['nitrite', /nitrite|\bNxr\b/i], ['methanol', /methanol|XoxF/i], ['sulfur', /sulfur|thiosulfate|\bSox\b|\bDsr\b/i]];
const REC_TRAITS = [['alginate', /alginate|\bPL(6|7|17)\b/i], ['laminarin', /laminarin|\bGH16\b/i], ['chitin', /chitin|fibre|fiber/i],
  ['sulfatase', /sulfatase/i], ['organic', /organic acid/i]];
const DIVE_TRAITS = [['metal', /metal breath|\bMtr[ABC]\b/i], ['methanol', /methanol|XoxF/i], ['organic', /organic acid/i], ['chitin', /chitin/i]];
const TOXINS = [  // antiSMASH cluster type -> quick toxin attack (first match wins)
  ['lanthipeptide', 'Lanthipeptide Zap', 'Lanthipeptides are natural antibiotics that punch holes in other bacteria, mostly Gram-positive ones.'],
  ['hydrogen-cyanide', 'Cyanide Puff', 'It has genes to make hydrogen cyanide, a gas that poisons the breathing enzymes of nearby cells.'],
  ['betalactone', 'Betalactone Blast', 'It has a gene cluster for betalactones, molecules that can jam other microbes’ enzymes.'],
  ['NRPS', 'NRPS Brew', 'Its NRPS gene cluster is an assembly line for peptides; many antibiotics are made this way.'],
  ['T1PKS', 'Polyketide Potion', 'Its PKS gene cluster builds polyketides, the family that includes many antibiotics.'],
  ['RiPP', 'Bacteriocin Shot', 'It has a gene cluster for small ribosomal peptides; many of these are bacteriocins that kill rival bacteria.'],
  ['NAPAA', 'Poly-Lysine Lash', 'Its NAPAA gene cluster makes long amino-acid chains like poly-lysine, which can kill other microbes.'],
];

// ---------- helpers ----------
const SEASON_OF = m => m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'fall' : 'winter';
const SEASONS = {spring: {name: 'Spring', icon: '🌨️'}, summer: {name: 'Summer', icon: '🌞'}, fall: {name: 'Fall', icon: '🌬️'}, winter: {name: 'Winter', icon: '❄️'}};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const tier = (v, cuts) => cuts.filter(c => v >= c).length;
const cellsText = n => n >= 1e6 ? `${n >= 1e7 ? Math.round(n / 1e6) : Math.round(n / 1e5) / 10} million` : n >= 1e3 ? `${Math.round(n / 1e3)} thousand` : 'a few';
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Everything the rules look at, pulled out of the data for one microbe.
function facts(c, nar, D) {
  const id = c.id, meta = D.meta?.[id] || {}, evo = D.evo?.[id] || {}, nm = D.northMap?.[id] || {};
  const n = Object.assign({}, c, nar || {});
  const markers = {};
  (D.circos?.[id]?.markers || []).forEach(m => { markers[m.label] = (markers[m.label] || 0) + 1; });
  const modules = {};
  (D.modules?.[id] || []).forEach(m => { modules[m.id] = m.c; });
  const lineage = Object.fromEntries((evo.classification || c.gtdb || '').split(';').map(s => s.trim().split('__')).filter(x => x.length === 2));
  const tags = (n.tags || []).join(' | '), acts = (n.activities || []).join(' | '), fn = n.fn || '';
  const bgc = Object.keys(markers).filter(k => k.startsWith('BGC: ')).map(k => k.slice(5)).join(' ');
  const gh = Object.entries(markers).filter(([k]) => /^CAZy: (GH|PL)\d/.test(k)).map(([k, v]) => [k.slice(6).replace(/[_(].*$/, ''), v]);
  gh.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  // cells per litre, as on the Distribution tab: relab% x cells/L x (mean genome / this genome)
  const CM = D.cellModel || {cells_per_litre: {}, mean_genome_bp: 3e6};
  const perL = (CM.cells_per_litre || {})[c.habitat] || 1e9, gsize = meta.size || CM.mean_genome_bp;
  const cells = v => (v || 0) / 100 * perL * CM.mean_genome_bp / gsize;
  const rows = nm.ci_samples || [];
  const found = rows.filter(r => r.detected).map(r => {
    const m = /^\d{8}$/.test(r.date || '') ? +r.date.slice(4, 6) : null;
    return {site: r.site, season: m ? SEASON_OF(m) : null, month: m, cells: cells(r.relab)};
  });
  const maxCells = Math.max(0, ...found.map(r => r.cells));
  const regional = nm.regional_stations || [];
  const ci = regional.find(r => r.is_ci) || {detected: found.length, n_samples: rows.length};
  const others = regional.filter(r => !r.is_ci);
  const oDet = others.reduce((a, r) => a + (r.detected || 0), 0), oN = others.reduce((a, r) => a + (r.n_samples || 0), 0);
  const canthyd = [...new Set((D.canthyd?.[id] || []).map(h => h.model || h.gene || h.name).filter(Boolean))];
  return {
    id, n, guild: n.guild, markers, modules, lineage, bgc, canthyd, found, maxCells, maxCellsText: cellsText(maxCells),
    phylum: (lineage.p || '').replace(/_[A-Z]$/, ''), domain: lineage.d || 'Bacteria',
    sizeMbp: (meta.size || 0) / 1e6, hypo: meta.hypo_pct, completeness: meta.completeness,
    localFrac: ci.n_samples ? ci.detected / ci.n_samples : 0, localDet: ci.detected, localN: ci.n_samples,
    regionFrac: oN ? oDet / oN : 0, regionDet: oDet, regionN: oN,
    topGH: gh[0] ? gh[0][0] : '',
    text: {tags, acts, fn, all: [tags, acts, fn].join(' | ')},
  };
}

// first trait (in list order) found in tags, then activities, then the Function text
function pickTrait(f, list) {
  for (const src of [f.text.tags, f.text.acts, f.text.fn])
    for (const [k, re] of list) if (re.test(src)) return k;
  return null;
}
const count = (s, re) => (s.match(new RegExp(re.source, 'gi')) || []).length;

function lifestyleOf(f) {
  if (LIFE_OF_GUILD[f.guild]) return LIFE_OF_GUILD[f.guild];  // the community chose a guild for it
  if (/Bdellovibrionota/.test(f.phylum) || /\bhunter\b|predator|eats other bacteria/i.test(f.text.tags)) return 'hunter';
  if (f.canthyd.length) return 'oil';
  const chemRe = /sulfur|thiosulfate|ammonia|nitrite|methanol/i, recRe = /seaweed|alginate|laminarin|sugar|fibre|fiber|chitin|sulfatase|organic acid|digest/i,
        sunRe = /sunlight|rhodopsin|solar/i;
  const score = {
    chem: 3 * Math.min(1, count(f.text.tags, chemRe)) + Math.min(1, count(f.text.acts, chemRe)),
    recycler: 3 * Math.min(1, count(f.text.tags, recRe)) + Math.min(1, count(f.text.acts, recRe)) + ((f.markers.Sulfatase || 0) >= 3 ? 1 : 0),
    sun: 2 * Math.min(1, count(f.text.tags, sunRe)) + (f.markers['Rhodopsin (Solar)'] || sunRe.test(f.text.acts) ? 1 : 0),
  };
  const best = ['chem', 'recycler', 'sun'].reduce((a, b) => score[b] > score[a] ? b : a);
  return score[best] > 0 ? best : 'recycler';  // a microbe with no clue eats dissolved organic matter
}

function envelopeOf(f, life) {
  if (/archaea/i.test(f.domain)) return 'archaea';
  if (/waxy|mycolic/i.test(f.text.all)) return 'waxy';
  if (GRAM_POSITIVE_PHYLA.test(f.phylum)) return 'positive';
  return life === 'hunter' ? 'hunter' : 'negative';
}

function badgesOf(f) {
  const b = [];
  if (f.markers['Rhodopsin (Solar)'] || /rhodopsin/i.test(f.text.all)) b.push('sun');
  if (f.markers['Cold-Shock (Csp)']) b.push('cold');
  if (f.markers.Osmoprotectant || /glycine betaine|osmoprotect/i.test(f.text.tags + f.text.acts)) b.push('salt');
  if (f.markers['CRISPR-Cas'] || /CRISPR/i.test(f.text.tags + f.text.acts)) b.push('crispr');
  if (f.sizeMbp && f.sizeMbp < TUNE.tinyMbp) b.push('tiny');
  if (f.canthyd.length) b.push('oil');
  return b;
}

function abilityOf(f, life) {
  if (life === 'hunter') return {key: 'burst', name: 'Burst Out',
    text: 'When this microbe washes out a rival, remove all damage from it.',
    why: 'A hunter grows inside its prey, then bursts out as several new cells.'};
  if (f.hypo != null && f.hypo >= TUNE.mysteryPct) return {key: 'mystery', name: 'Mystery Genes',
    text: 'When this microbe attacks, flip a coin. Heads: +20 damage.',
    why: `${Math.round(f.hypo)}% of its genes do something nobody has figured out yet.`};
  if (/hserlactone/.test(f.bgc)) return {key: 'quorum', name: 'Quorum Sensing',
    text: 'If you have 2 or more microbes on your bench, its attacks do +10 damage.',
    why: 'It can make homoserine lactones, signal molecules bacteria use to count their neighbours before acting together.'};
  if (f.markers['RuBisCO (CBB)'] || /carbon dioxide into food|carbon catcher|rubisco/i.test(f.text.tags + f.text.acts)) return {key: 'fix', name: 'Carbon Catcher',
    text: `At the end of your turn, remove ${TUNE.healFix} damage from this microbe.`,
    why: f.markers['RuBisCO (CBB)'] ? 'It has RuBisCO, the enzyme plants use to turn carbon dioxide into food, so it can feed itself.' : 'It has genes to turn carbon dioxide into food, so it can feed itself.'};
  const b12 = (f.markers['Cobalamin (Vit B12)'] || 0) >= 2 || (f.modules.M00120 || 0) >= 0.6;
  if (b12 || /vitamin/i.test(f.text.tags + f.text.acts)) return {key: 'vitamin', name: 'Vitamin Share',
    text: 'When you feed this microbe, also remove 10 damage from one of your microbes.',
    why: b12 ? 'It has many genes for vitamin B12, which half of all algae need but cannot make.' : 'It makes B vitamins that algae and other microbes need but cannot make.'};
  if (/stick|adhesion|attach/i.test(f.text.acts + f.text.fn)) return {key: 'hold', name: 'Hold Fast',
    text: 'Tide Turns cannot move this microbe.',
    why: 'Sticky surface proteins let it hold on to particles and bits of algae.'};
  return null;
}

function moveOf(f) {
  if (/swim|flagell|whip-like/i.test(f.text.tags + f.text.acts)) return 'swim';
  if (/glid/i.test(f.text.tags + f.text.acts)) return 'glide';
  return null;
}

function toxinOf(f) {
  for (const [re, name, why] of TOXINS) if (new RegExp(re).test(f.bgc)) return {name, why};
  return null;
}

function attacksOf(f, life, b, badges) {
  const tiny = badges.includes('tiny');
  // big attack: the lifestyle's signature, using the most specific gene the microbe has
  let sig = life;
  if (life === 'chem') sig = pickTrait(f, CHEM_TRAITS) || 'sulfur';
  if (life === 'recycler') sig = pickTrait(f, REC_TRAITS) || 'sugar';
  if (life === 'oil') sig = f.canthyd.length ? 'oil' : pickTrait(f, DIVE_TRAITS) || 'leftovers';
  const S = SIG[sig];
  const a2 = {slot: 2, key: sig, name: S.name(f), kind: S.kind, cost: life === 'hunter' ? TUNE.hunterCost : Math.max(1, TUNE.a2Cost[b] - (tiny ? TUNE.tinyDiscount : 0)),
    dmg: life === 'hunter' ? TUNE.hunterA2 : TUNE.a2Dmg[b], why: S.why(f), effect: null};
  // quick attack: hunters chase; then a toxin; then the light pump; then gliding; else plain metabolism
  const tox = toxinOf(f), move = moveOf(f);
  let a1;
  const d1 = TUNE.a1Dmg[b];
  if (life === 'hunter') a1 = {key: 'chase', name: 'Chemotaxis Chase', kind: 'hunt', dmg: 10, effect: {type: 'snipe'},
    text: 'Hit any one rival microbe, Active or Bench.',
    why: 'It swims with a whip-like tail and smells its way to prey (chemotaxis).'};
  else if (tox) a1 = {key: 'toxin', name: tox.name, kind: 'toxin', dmg: d1, effect: null, why: tox.why};
  else if (badges.includes('sun') && life !== 'sun') a1 = {key: 'pump', name: 'Light Pump', kind: 'grow', dmg: 10, effect: {type: 'selfFeed'},
    text: 'Put 1 nutrient on this microbe.',
    why: 'A rhodopsin pump turns light into extra energy, so it can grow while it competes.'};
  else if (move) a1 = {key: 'move', name: move === 'glide' ? 'Glide Away' : 'Dash Away', kind: 'grow', dmg: d1, effect: {type: 'freeSwitch'},
    text: 'You may then switch it with one of your bench microbes for free.',
    why: move === 'glide' ? 'It glides over surfaces using tiny tracks in its outer layer.' : 'It swims with a whip-like tail.'};
  else if (badges.includes('sun')) a1 = {key: 'pump', name: 'Light Pump', kind: 'grow', dmg: 10, effect: {type: 'selfFeed'},
    text: 'Put 1 nutrient on this microbe.',
    why: 'A rhodopsin pump turns light into extra energy, so it can grow while it competes.'};
  else a1 = {key: 'tca', name: 'TCA Cycle Spin', kind: 'grow', dmg: d1, effect: null,
    why: 'The TCA cycle burns food to power the cell; it is the same cycle that runs in your own cells.'};
  a1.slot = 1; a1.cost = 1;
  return [a1, a2];
}

function scienceLine(f, life, card) {
  const lead = {
    hunter: 'It belongs to a group of bacteria that hunt and eat other bacteria.',
    oil: f.canthyd.length ? `Its genome has ${f.canthyd.join(' and ')}, a gene for breaking down oil.` : null,
    sun: 'A rhodopsin pump lets it catch energy from light.',
  }[life] || card.attacks[1].why.split('. ')[0].replace(/\.$/, '') + '.';
  const top = f.found.slice().sort((a, b) => b.cells - a.cells)[0];
  const when = top && top.month ? MONTHS[top.month - 1] : 'date not recorded';
  return top ? `${lead} Most seen: about ${f.maxCellsText} cells per litre (${top.site}, ${when}).` : lead;
}

function microbeCard(c, nar, D, num) {
  const f = facts(c, nar, D);
  const life = lifestyleOf(f), env = envelopeOf(f, life), E = ENVELOPES[env];
  const b = tier(f.maxCells, TUNE.bloomCuts);
  const spread = Math.min(TUNE.spreadCap, tier(f.localFrac, TUNE.spreadLocal) + tier(f.regionFrac, TUNE.spreadRegion));
  const big = f.sizeMbp >= TUNE.bigGenomeMbp;
  const badges = badgesOf(f);
  const move = moveOf(f);
  const ability = abilityOf(f, life);
  const card = {
    type: 'microbe', id: f.id, num, name: f.n.nickname || f.id, habitat: c.habitat, img: c.img || null,
    lifestyle: life, envelope: env, envelopeName: E.name,
    // GTDB class, shown on the card face; the long proteobacteria names use the usual Greek short form
    className: (f.lineage.c || '').replace(/_[A-Z]+$/, '').replace(/^(Alpha|Beta|Gamma|Delta)proteobacteria$/, (m, g) => ({Alpha: 'α', Beta: 'β', Gamma: 'γ', Delta: 'δ'})[g] + '-Proteobacteria'),
    hp: TUNE.hpBase + TUNE.hpPerSpread * spread + (big ? TUNE.hpBigGenome : 0),
    weak: E.weak, resist: E.resist, immune: E.immune,
    retreat: move ? 0 : ability && ability.key === 'hold' ? 2 : 1,
    badges, ability, bloom: b, spread,
    genomeMbp: Math.round(f.sizeMbp * 100) / 100,
    attacks: attacksOf(f, life, b, badges),
    home: [],
  };
  // where and when it was found: one entry per site, with its seasons (null = date not recorded)
  const bySite = {};
  f.found.forEach(r => { (bySite[r.site] = bySite[r.site] || new Set()).add(r.season); });
  card.home = Object.entries(bySite).map(([site, s]) => ({site, seasons: [...s]}));
  // a microbe grown in the lab (candidates.js `isolated`) also counts as found where its water was collected
  const iso = f.n.isolated;
  if (iso && iso.site) {
    const h = card.home.find(x => x.site === iso.site);
    if (h) { if (!h.seasons.includes(iso.season || null)) h.seasons.push(iso.season || null); h.lab = true; }
    else card.home.push({site: iso.site, seasons: [iso.season || null], lab: true});
  }
  card.homeText = card.home.map(h => h.site).join(', ');
  // peak season: the season of its highest count among dated samples (none if no sample had a date)
  const dated = f.found.filter(r => r.season).sort((a, b) => b.cells - a.cells);
  card.peak = dated.length ? dated[0].season : iso && iso.season || null;
  card.science = scienceLine(f, life, card);
  card.stats = statNotes(f, card, spread, b, big, move);
  return card;
}

// plain-language notes on where each number came from (shown on the big card view)
function statNotes(f, card, spread, b, big, move) {
  const pc = x => Math.round(x * 100) + '%';
  return [
    ['HP ' + card.hp, `${TUNE.hpBase}, +${TUNE.hpPerSpread} if found in at least ${pc(TUNE.spreadLocal[0])} of local samples (${f.localDet} of ${f.localN}: ${f.localFrac >= TUNE.spreadLocal[0] ? 'yes' : 'no'}), +${TUNE.hpPerSpread} if found in at least ${pc(TUNE.spreadRegion[0])} of other northern samples (${f.regionDet} of ${f.regionN}: ${f.regionFrac >= TUNE.spreadRegion[0] ? 'yes' : 'no'}), +${TUNE.hpBigGenome} if its genome is ${TUNE.bigGenomeMbp} Mbp or more (${card.genomeMbp} Mbp: ${big ? 'yes' : 'no'}). Microbes found in many places are hard to wipe out.`],
    ['Damage', `Bloom tier ${b} of 3: up to ${f.maxCellsText} cells per litre in one local sample. Microbes that reach big numbers hit harder.`],
    ['Type', `${LIFESTYLES[card.lifestyle].name}: ${LIFESTYLES[card.lifestyle].text}`],
    ...(f.lineage.c ? [['Class', `${(f.lineage.c || '').replace(/_[A-Z]+$/, '')}, a class in the phylum ${f.phylum} (GTDB). A class is the rank above order and below phylum.`]] : []),
    ['Cell wall', `${ENVELOPES[card.envelope].name}. ${ENVELOPES[card.envelope].text}`],
    ['Retreat ' + card.retreat, move ? `It can ${move === 'glide' ? 'glide' : 'swim'}, so moving costs nothing.` : card.retreat === 2 ? 'It holds on tight to particles, so moving costs more.' : 'It drifts with the water.'],
  ];
}

// ---------- places (stadiums): every site × season that was sampled ----------
function placeCards(cards, D, community) {
  const sites = D.ciSites || [];
  const sampled = {};  // site -> Set(season) from dated samples of any microbe
  Object.values(D.northMap || {}).forEach(nm => (nm.ci_samples || []).forEach(r => {
    if (!/^\d{8}$/.test(r.date || '')) return;
    const m = +r.date.slice(4, 6);
    const k = r.site; (sampled[k] = sampled[k] || {}); (sampled[k][SEASON_OF(m)] = sampled[k][SEASON_OF(m)] || new Set()).add(m);
  }));
  const out = [];
  sites.forEach(s => {
    const water = /fresh|lake|river/i.test(s.type || '') ? 'freshwater' : 'marine';
    Object.entries(sampled[s.name] || {}).forEach(([season, months]) => {
      const homes = cards.filter(c => c.home.some(h => h.site === s.name && (h.seasons.includes(season) || h.seasons.includes(null))));
      out.push({
        type: 'place', id: `place-${slug(s.name)}-${season}`, name: s.name, season, water,
        months: [...months].sort((a, b) => a - b).map(m => MONTHS[m - 1]),
        homes: homes.map(c => ({id: c.id, name: c.name, undated: !c.home.find(h => h.site === s.name).seasons.includes(season)})),
        effect: {type: 'peakBoost', season},
      });
    });
  });
  // a place card is only worth printing if at least 2 microbes were found there in that season
  const keep = out.filter(p => p.homes.filter(h => !h.undated).length >= 2);
  out.length = 0; out.push(...keep);
  // order by the familiar name in brackets when there is one, e.g. 'Puirsuk (1st Lake)' sorts as '1st Lake'
  const sortName = n => (/\(([^)]+)\)\s*$/.exec(n) || [, n])[1];
  out.sort((a, b) => (a.water === b.water ? 0 : a.water === 'marine' ? -1 : 1) || sortName(a.name).localeCompare(sortName(b.name)) || a.season.localeCompare(b.season));
  out.forEach((p, i) => { p.num = cards.length + i + 1; });
  return out;
}
const SEASON_TEXT = {
  spring: '🌨️ spring microbes do +10 damage here.',
  fall: '🌬️ fall microbes do +10 damage here.',
  summer: 'Microbes that peak in summer do +10 damage here.', winter: 'Microbes that peak in winter do +10 damage here.',
};

// ---------- events (support cards): the same for every community ----------
const EVENTS = [
  {id: 'phage', name: 'Phage Attack', icon: '🦠', target: 'none',
    text: 'The microbe in play (either side) with the most HP left takes 30 damage. 🛡 CRISPR microbes take 10 less.',
    why: '"Kill the winner": viruses spread fastest through the most common microbe. CRISPR-Cas cuts up viruses it remembers.'},
  {id: 'grazer', name: 'Hungry Grazer', icon: '🍴', target: 'none',
    text: '30 damage to the rival Active. 🔹 Tiny microbes take no damage.',
    why: 'Single-celled grazers swallow bacteria, but very small cells often slip past them.'},
  {id: 'freeze', name: 'Freeze-Up', icon: '🧊', target: 'none',
    text: 'Every Active microbe without ❄ takes 20 damage.',
    why: 'When the water freezes over, cells must keep working near 0°C (in sea ice they are squeezed into salty brine). Cold-shock proteins help.'},
  {id: 'midnightsun', name: 'Long Days', icon: '🌅', target: 'none',
    text: 'Put 1 nutrient on each of up to 2 of your ☀ microbes.',
    why: 'Spring days in the North are very long, so microbes with light-catching pumps get extra energy.'},
  {id: 'bloom', name: 'Algae Bloom', icon: '🌿', target: 'own',
    text: 'Put 2 nutrients on one of your 🥬 Voracious Vegetarians, or 1 on any other microbe.',
    why: 'When algae bloom and die, sugar-eating bacteria bloom right after them.'},
  {id: 'stirup', name: 'Mud Stir-Up', icon: '🌊', target: 'own',
    text: 'Put 2 nutrients on one of your 🎒 Peppy Preppers, or 1 on any other microbe.',
    why: 'Wind and waves stir up bottom mud, releasing ammonium and sulfur compounds that Peppy Preppers burn for energy.'},
  {id: 'spill', name: 'Fuel Spill', icon: '🛢️', target: 'none',
    text: 'Put 2 nutrients on each of your 🛢 microbes (oil gene). Every Active microbe without 🛢 takes 10 damage.',
    why: 'Fuel is toxic to most microbes, but those with oil-eating genes can use it as food and bloom after a spill.'},
  {id: 'tide', name: 'Tide Turns', icon: '↔️', target: 'rivalBench',
    text: 'Switch the rival Active with one of their bench microbes (you choose).',
    why: 'Tides and currents mix the water and carry microbes from place to place.'},
  {id: 'hgt', name: 'Gene Swap', icon: '🧬', target: 'none',
    text: 'This turn, your Active may use an attack printed on one of your bench microbes (it still pays the cost).',
    why: 'Bacteria pass genes to each other (horizontal gene transfer), sometimes picking up whole new abilities.'},
  {id: 'b12', name: 'Vitamin Gift', icon: '💊', target: 'own',
    text: 'Remove 30 damage from one of your microbes.',
    why: 'Neighbours share B vitamins; a microbe that cannot make B12 can grow again when another microbe makes it.'},
  {id: 'seedbank', name: 'Seed Bank', icon: '💤', target: 'own',
    text: 'Return one of your microbes in play to your hand. Remove its damage and its nutrients.',
    why: 'Many microbes wait, rare or dormant, until conditions improve; scientists call this the seed bank.'},
  {id: 'trip', name: 'Field Trip', icon: '🧭', target: 'none',
    text: 'Look at the top 3 Place cards and put one into play. Put the others on the bottom.',
    why: 'Different places and seasons hold different microbes, so where and when you sample changes what you find.'},
];

function buildDeck({candidates, narratives, data, community}) {
  const D = data || {}, N = narratives || {};
  const microbes = (candidates || []).filter(c => D.meta?.[c.id] || D.northMap?.[c.id])
    .map((c, i) => microbeCard(c, N[c.id], D, i + 1));
  const places = placeCards(microbes, D, community || {});
  const events = EVENTS.map((e, i) => Object.assign({type: 'event', num: microbes.length + places.length + i + 1}, e));
  places.forEach(p => { p.text = SEASON_TEXT[p.season] || ''; });
  // card pictures, by convention (missing ones fall back to the emoji): place art is the
  // community's own (communities/<id>/img/cards/), event art is shared (site/img/cards/)
  places.forEach(p => { p.art = `img/cards/${p.id}.jpg`; });
  events.forEach(e => { e.art = `img/cards/event-${e.id}.jpg`; });
  return {microbes, places, events, title: (community && community.brand) || 'Microbe Cards'};
}

const API = {TUNE, LIFESTYLES, KINDS, BADGES, ENVELOPES, SEASONS, EVENTS, SEASON_TEXT, buildDeck, facts, cellsText};
root.MicrobeCards = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
