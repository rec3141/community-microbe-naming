// Rules engine for the microbe card game, plus a simple computer player. Shared by the
// on-screen game (cards.html) and the balance simulator (scripts/build/card_sim.js).
// The printed rules in docs/card_game.md and cards.html describe exactly what this does.
(function (root) {
'use strict';
const MC = root.MicrobeCards || (typeof require !== 'undefined' ? require('./engine.js') : null);
const T = MC.TUNE;

function rng(seed) {  // mulberry32: small, seedable, good enough for shuffling
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

class Game {
  // deck: MicrobeCards.buildDeck(...); teams: [[microbe ids], [microbe ids]]; opts: {seed, first, rules}
  constructor(deck, teams, opts = {}) {
    this.deck = deck; this.r = rng(opts.seed ?? 1); this.rules = Object.assign({}, T, opts.rules || {});
    this.byId = Object.fromEntries(deck.microbes.map(c => [c.id, c]));
    this.ev = Object.fromEntries(deck.events.map(e => [e.id, e]));
    let uid = 0;
    this.players = teams.map((ids, p) => ({p, hand: ids.map(id => ({uid: ++uid, card: this.byId[id], dmg: 0, nut: 0, owner: p})), active: null, bench: [], events: [], score: 0}));
    this.eventDeck = shuffle(deck.events.map(e => e.id), this.r); this.eventDiscard = [];
    this.placeDeck = shuffle(deck.places.map(p => p.id), this.r);
    this.placeById = Object.fromEntries(deck.places.map(p => [p.id, p]));
    this.place = this.placeById[this.placeDeck.shift()];
    this.cur = opts.first ?? 0; this.turn = 0; this.winner = null; this.log = []; this.pending = null;
    this.players.forEach(pl => { for (let i = 0; i < this.rules.handStart; i++) this.drawEvent(pl); });
  }
  say(msg) { this.log.push(msg); if (this.onLog) this.onLog(msg); }
  rival(p) { return this.players[1 - p]; }
  inPlay(pl) { return [pl.active, ...pl.bench].filter(Boolean); }
  drawEvent(pl) {
    if (!this.eventDeck.length) { this.eventDeck = shuffle(this.eventDiscard, this.r); this.eventDiscard = []; }
    if (this.eventDeck.length) pl.events.push(this.eventDeck.shift());
  }
  isHome(m) { return this.place.homes.some(h => h.id === m.card.id); }
  outOfPlace(m) { return m.card.habitat !== this.place.water && !(this.place.water === 'marine' && m.card.badges.includes('salt')); }

  // ---- setup: each player puts an Active and up to 3 on the bench ----
  setup(p, activeUid, benchUids = []) {
    const pl = this.players[p], take = u => { const i = pl.hand.findIndex(m => m.uid === u); return i < 0 ? null : pl.hand.splice(i, 1)[0]; };
    pl.active = take(activeUid);
    benchUids.slice(0, this.rules.benchMax).forEach(u => { const m = take(u); if (m) pl.bench.push(m); });
  }

  // ---- turn ----
  startTurn() {
    const pl = this.players[this.cur];
    this.turn++; this.t = {fed: false, event: false, retreated: false, attacked: false, geneSwap: false};
    this.drawEvent(pl);
    const a = pl.active;
    if (a && this.outOfPlace(a)) {
      this.say(`${a.card.name} is in the wrong water (${this.place.water === 'marine' ? 'salt' : 'fresh'}): 10 damage.`);
      this.damage(a, 10, null);
    }
  }
  canFeed() { return !this.t.fed && !this.winner; }
  feed(uid) {
    const pl = this.players[this.cur], m = this.inPlay(pl).find(x => x.uid === uid);
    if (!m || !this.canFeed()) return false;
    const n = this.isHome(m) ? 2 : 1;
    m.nut += n; this.t.fed = true;
    this.say(`${m.card.name} is fed ${n} nutrient${n > 1 ? 's' : ''}${n > 1 ? ' (it lives here)' : ''}.`);
    if (m.card.ability?.key === 'vitamin') {
      const hurt = this.inPlay(pl).filter(x => x.dmg > 0).sort((a, b) => b.dmg - a.dmg)[0];
      if (hurt) { hurt.dmg = Math.max(0, hurt.dmg - 10); this.say(`Vitamin Share heals ${hurt.card.name} by 10.`); }
    }
    return true;
  }
  benchFromHand(uid) {
    const pl = this.players[this.cur], i = pl.hand.findIndex(m => m.uid === uid);
    if (i < 0 || pl.bench.length >= this.rules.benchMax) return false;
    const m = pl.hand.splice(i, 1)[0];
    if (!pl.active) pl.active = m; else pl.bench.push(m);
    this.say(`${m.card.name} joins the ${pl.active === m ? 'front' : 'bench'}.`);
    return true;
  }
  retreatCost(m) { return m.card.retreat; }
  canRetreat() { const pl = this.players[this.cur]; return !this.t.retreated && pl.bench.length && pl.active && pl.active.nut >= this.retreatCost(pl.active); }
  retreat(benchUid, free = false) {
    const pl = this.players[this.cur], i = pl.bench.findIndex(m => m.uid === benchUid);
    if (i < 0 || (!free && !this.canRetreat())) return false;
    const old = pl.active;
    if (!free) { old.nut -= this.retreatCost(old); this.t.retreated = true; }
    pl.active = pl.bench[i]; pl.bench[i] = old;
    this.say(`${old.card.name} moves back; ${pl.active.card.name} comes forward.`);
    return true;
  }

  // ---- attacks ----
  attacksFor(m) {
    const out = m.card.attacks.map(a => ({a, from: m}));
    if (this.t.geneSwap) this.players[this.cur].bench.forEach(b => b.card.attacks.forEach(a => out.push({a, from: b, borrowed: true})));
    return out;
  }
  canPay(m, a) { return m.nut >= a.cost; }
  // damage the attack would do to target (no coin flips): weakness, resistance, immunity, season, abilities
  calcDamage(att, a, target, {flip = false} = {}) {
    if (target.card.immune.includes(a.kind)) return 0;
    let d = a.dmg;
    const pl = this.players[att.owner];
    if (att.card.peak && att.card.peak === this.place.season) d += this.rules.seasonBonus;
    if (att.card.ability?.key === 'quorum' && pl.bench.length >= 2) d += 10;
    if (att.card.ability?.key === 'mystery' && flip) d += 20;
    if (target.card.weak === a.kind) d *= this.rules.weakMult;
    if (target.card.resist === a.kind) d -= this.rules.resist;
    return Math.max(0, d);
  }
  attack(idx, targetUid) {
    const pl = this.players[this.cur], me = pl.active, opp = this.rival(this.cur);
    if (!me || this.t.attacked || this.winner) return false;
    if (this.turn === 1) { this.say('The first player cannot attack on the very first turn.'); return false; }
    const choice = this.attacksFor(me)[idx]; if (!choice) return false;
    const a = choice.a;
    this.stats = this.stats || {a1: 0, a2: 0}; this.stats[a.slot === 1 ? 'a1' : 'a2']++;
    if (!this.canPay(me, a)) return false;
    let target = opp.active;
    if (a.effect?.type === 'snipe' && targetUid != null) target = this.inPlay(opp).find(x => x.uid === targetUid) || opp.active;
    if (!target) return false;
    this.t.attacked = true;
    const flip = me.card.ability?.key === 'mystery' ? this.r() < 0.5 : false;
    if (me.card.ability?.key === 'mystery') this.say(`Mystery Genes coin: ${flip ? 'heads, +20!' : 'tails.'}`);
    const d = this.calcDamage(me, a, target, {flip});
    this.say(`${me.card.name} uses ${a.name}${choice.borrowed ? ` (borrowed from ${choice.from.card.name})` : ''}: ${d} damage to ${target.card.name}.`);
    if (a.effect?.type === 'selfFeed') { me.nut += 1; this.say(`${me.card.name} gains 1 nutrient from light.`); }
    this.damage(target, d, me);
    if (a.effect?.type === 'freeSwitch' && this.pending == null && this.onFreeSwitch) this.onFreeSwitch(me);
    return true;
  }
  damage(m, d, by) {
    if (d <= 0) return;
    m.dmg += d;
    if (m.dmg >= m.card.hp) this.washOut(m, by);
  }
  washOut(m, by) {
    const owner = this.players[m.owner], other = this.rival(m.owner);
    this.say(`${m.card.name} is washed out!`);
    if (owner.active === m) owner.active = null; else owner.bench = owner.bench.filter(x => x !== m);
    other.score++;
    if (this.firstLoss == null) this.firstLoss = m.owner;
    if (by && by.card.ability?.key === 'burst' && by.owner !== m.owner) { by.dmg = 0; this.say(`${by.card.name} bursts out of its prey, fully healed.`); }
    if (other.score >= this.rules.winScore) { this.winner = other.p; this.say(`Player ${other.p + 1} wins!`); return; }
    if (!this.inPlay(owner).length && !owner.hand.length) { this.winner = other.p; this.say(`Player ${other.p + 1} wins: no microbes left!`); return; }
    // the player who lost a microbe picks the next place from the top 2
    this.pendingPlace = m.owner;
    if (!owner.active) this.pendingPromote = m.owner;
  }
  promote(p, uid) {  // choose a new Active from bench (or hand if the bench is empty)
    const pl = this.players[p];
    if (pl.active) { this.pendingPromote = null; return false; }
    let i = pl.bench.findIndex(m => m.uid === uid);
    if (i >= 0) pl.active = pl.bench.splice(i, 1)[0];
    else { i = pl.hand.findIndex(m => m.uid === uid); if (i < 0) return false; pl.active = pl.hand.splice(i, 1)[0]; }
    this.pendingPromote = null; this.say(`${pl.active.card.name} comes forward.`);
    return true;
  }
  placeChoices(n = 2) { return this.placeDeck.slice(0, n).map(id => this.placeById[id]); }
  setPlace(id) {
    const i = this.placeDeck.indexOf(id); if (i < 0) return false;
    const old = this.place; this.placeDeck.splice(i, 1);
    // the others looked at go to the bottom; the old place goes to the bottom too
    this.placeDeck.push(old.id);
    this.place = this.placeById[id]; this.pendingPlace = null;
    this.say(`The scene changes: ${this.place.name}, ${this.place.season}.`);
    return true;
  }

  // ---- events ----
  eventTargets(id) {  // what the player must choose, if anything
    const pl = this.players[this.cur], opp = this.rival(this.cur), e = this.ev[id];
    if (id === 'bloom' || id === 'stirup' || id === 'b12' || id === 'seedbank') return this.inPlay(pl);
    if (id === 'tide') return opp.bench.filter(m => opp.active?.card.ability?.key !== 'hold');
    if (id === 'trip') return this.placeChoices(3);
    if (id === 'hgt') return [];
    return e ? [] : null;
  }
  playEvent(id, target) {
    const pl = this.players[this.cur], opp = this.rival(this.cur);
    const i = pl.events.indexOf(id);
    if (i < 0 || this.t.event || this.winner) return false;
    const all = [...this.inPlay(pl), ...this.inPlay(opp)];
    const e = this.ev[id];
    const pickOwn = () => this.inPlay(pl).find(m => m.uid === target);
    switch (id) {
      case 'phage': {
        if (!all.length) return false;
        const left = m => m.card.hp - m.dmg, max = Math.max(...all.map(left));
        const tied = all.filter(m => left(m) === max);
        const v = tied.find(m => m.uid === target) || tied.find(m => m.owner !== this.cur) || tied[0];
        const d = 30 - (v.card.badges.includes('crispr') ? 10 : 0);
        this.say(`Phage Attack hits ${v.card.name} (most HP left): ${d} damage.`);
        this.consume(pl, i); this.damage(v, d, null); return true;
      }
      case 'grazer': {
        const v = opp.active; if (!v) return false;
        const d = v.card.badges.includes('tiny') ? 0 : 30;
        this.say(`A grazer goes after ${v.card.name}: ${d ? d + ' damage' : 'too tiny to catch'}.`);
        this.consume(pl, i); this.damage(v, d, null); return true;
      }
      case 'freeze': {
        this.consume(pl, i); this.say('Freeze-Up!');
        [pl.active, opp.active].filter(Boolean).forEach(m => { if (!m.card.badges.includes('cold')) { this.say(`${m.card.name} takes 20 from the cold.`); this.damage(m, 20, null); } });
        return true;
      }
      case 'midnightsun': {
        const sun = this.inPlay(pl).filter(m => m.card.badges.includes('sun'));
        if (!sun.length) return false;
        const picks = target != null ? sun.filter(m => [].concat(target).includes(m.uid)).slice(0, 2) : sun.slice(0, 2);
        (picks.length ? picks : sun.slice(0, 2)).forEach(m => { m.nut++; this.say(`${m.card.name} soaks up the long days: +1 nutrient.`); });
        this.consume(pl, i); return true;
      }
      case 'bloom': case 'stirup': {
        const m = pickOwn(); if (!m) return false;
        const want = id === 'bloom' ? 'recycler' : 'chem', n = m.card.lifestyle === want ? 2 : 1;
        m.nut += n; this.say(`${e.name}: ${m.card.name} gets ${n} nutrient${n > 1 ? 's' : ''}.`);
        this.consume(pl, i); return true;
      }
      case 'spill': {
        this.consume(pl, i); this.say('Fuel Spill!');
        this.inPlay(pl).filter(m => m.card.lifestyle === 'oil').forEach(m => { m.nut += 2; this.say(`${m.card.name} feeds on the fuel: +2 nutrients.`); });
        [pl.active, opp.active].filter(Boolean).forEach(m => { if (m.card.lifestyle !== 'oil') { this.say(`${m.card.name} takes 10 from the fuel.`); this.damage(m, 10, null); } });
        return true;
      }
      case 'tide': {
        if (!opp.active || !opp.bench.length || opp.active.card.ability?.key === 'hold') return false;
        const j = Math.max(0, opp.bench.findIndex(m => m.uid === target));
        const old = opp.active; opp.active = opp.bench[j]; opp.bench[j] = old;
        this.say(`Tide Turns: ${opp.active.card.name} is pulled to the front.`);
        this.consume(pl, i); return true;
      }
      case 'hgt': { this.t.geneSwap = true; this.say('Gene Swap: the Active can use a bench microbe’s attack this turn.'); this.consume(pl, i); return true; }
      case 'b12': {
        const m = pickOwn(); if (!m || !m.dmg) return false;
        m.dmg = Math.max(0, m.dmg - 30); this.say(`Vitamin Gift heals ${m.card.name}.`); this.consume(pl, i); return true;
      }
      case 'seedbank': {
        const m = pickOwn(); if (!m || this.inPlay(pl).length < 2) return false;
        if (pl.active === m) { pl.active = null; } else pl.bench = pl.bench.filter(x => x !== m);
        m.dmg = 0; m.nut = 0; pl.hand.push(m); this.say(`${m.card.name} goes dormant and waits in the seed bank.`);
        if (!pl.active) { pl.active = pl.bench.shift(); this.say(`${pl.active.card.name} comes forward.`); }
        this.consume(pl, i); return true;
      }
      case 'trip': {
        const ch = this.placeChoices(3); if (!ch.length) return false;
        const pick = ch.find(p => p.id === target) || ch[0];
        this.consume(pl, i);
        ch.filter(p => p !== pick).forEach(p => { this.placeDeck.splice(this.placeDeck.indexOf(p.id), 1); this.placeDeck.push(p.id); });
        this.setPlace(pick.id); return true;
      }
    }
    return false;
  }
  consume(pl, i) { this.eventDiscard.push(pl.events.splice(i, 1)[0]); this.t.event = true; }

  endTurn() {
    const pl = this.players[this.cur];
    this.inPlay(pl).forEach(m => { if (m.card.ability?.key === 'fix' && m.dmg > 0) { m.dmg = Math.max(0, m.dmg - this.rules.healFix); this.say(`${m.card.name} makes its own food: heals 10.`); } });
    this.cur = 1 - this.cur;
  }
}

// ======================= computer player =======================
// A greedy player: good enough to test balance and to play against at the workshop.
const AI = {
  value(card) {  // rough draft value of a card
    const a2 = card.attacks[1], a1 = card.attacks[0];
    return card.hp + 1.2 * a2.dmg * (3 / (a2.cost + 1)) + 0.6 * a1.dmg + (card.ability ? 10 : 0) + (card.retreat === 0 ? 5 : 0);
  },
  draft(pool, mine, theirs, r, style = 'greedy') {
    if (style === 'random') return pool[Math.floor(r() * pool.length)];
    const scored = pool.map(c => {
      let v = AI.value(c);
      // counter-picks: hunters are great against Gram-negatives, Gram-positives against hunters
      const tHunters = theirs.filter(x => x.lifestyle === 'hunter').length;
      if (c.immune.includes('hunt')) v += 12 * tHunters;
      if (c.lifestyle === 'hunter') v += 4 * theirs.filter(x => x.weak === 'hunt').length - 6 * theirs.filter(x => x.immune.includes('hunt')).length;
      // keep a team that can live in one kind of water
      const same = mine.filter(x => x.habitat === c.habitat).length;
      v += 4 * same;
      return {c, v: v + r() * 6};
    });
    scored.sort((a, b) => b.v - a.v);
    return scored[0].c;
  },
  bestAttack(g, m, opp) {
    let best = null;
    g.attacksFor(m).forEach((ch, idx) => {
      const a = ch.a; if (m.nut < a.cost) return;
      const targets = a.effect?.type === 'snipe' ? g.inPlay(opp) : [opp.active].filter(Boolean);
      targets.forEach(t => {
        const d = g.calcDamage(m, a, t);
        const ko = t.dmg + d >= t.card.hp;
        let v = d + (ko ? 100 : 0) + (a.effect?.type === 'selfFeed' ? 8 : 0) + (t === opp.active ? 1 : 0);
        if (!best || v > best.v) best = {idx, target: t.uid, v, d, ko};
      });
    });
    return best;
  },
  cheapestAttack(g, m, opp) {  // 'rush': attack right away with the first affordable attack
    const i = g.attacksFor(m).findIndex(ch => m.nut >= ch.a.cost);
    return i < 0 ? null : {idx: i, target: opp.active?.uid};
  },
  threat(g, me, opp) {  // most damage the rival Active could do to `me` next turn
    const o = opp.active; if (!o) return 0;
    return Math.max(0, ...o.card.attacks.filter(a => o.nut + 2 >= a.cost).map(a => g.calcDamage(o, a, me)));
  },
  promote(g, p) {
    const pl = g.players[p], opp = g.rival(p);
    const cands = pl.bench.length ? pl.bench : pl.hand;
    const score = m => (m.card.hp - m.dmg) + 8 * m.nut + (g.outOfPlace(m) ? -15 : 0) + (opp.active && opp.active.card.attacks.some(a => m.card.immune.includes(a.kind)) ? 25 : 0) - (opp.active && opp.active.card.attacks.some(a => m.card.weak === a.kind) ? 20 : 0);
    const best = cands.slice().sort((a, b) => score(b) - score(a))[0];
    g.promote(p, best.uid);
  },
  choosePlace(g, p, choices) {
    const pl = g.players[p], opp = g.rival(p);
    const score = pc => {
      const mine = g.inPlay(pl).concat(pl.hand), theirs = g.inPlay(opp).concat(opp.hand);
      const s = (list, sgn) => list.reduce((a, m) => a + sgn * ((pc.homes.some(h => h.id === m.card.id) ? 2 : 0) + (m.card.habitat === pc.water ? 2 : 0)), 0);
      return s(mine, 1) + s(theirs, -1);
    };
    return choices.slice().sort((a, b) => score(b) - score(a))[0];
  },
  // forced choices (a new Active, the next Place) for computer-controlled players only
  resolvePending(g) {
    const ai = p => !g.human || !g.human[p];
    if (g.pendingPromote != null && ai(g.pendingPromote)) AI.promote(g, g.pendingPromote);
    if (g.pendingPlace != null && ai(g.pendingPlace)) { const ch = g.placeChoices(2); if (ch.length) g.setPlace(AI.choosePlace(g, g.pendingPlace, ch).id); else g.pendingPlace = null; }
  },
  // one whole turn for the current player
  turn(g, style = 'greedy') {
    const p = g.cur, pl = g.players[p], opp = g.rival(p), r = g.r;
    AI.resolvePending(g);
    if (!pl.active && (pl.bench.length || pl.hand.length)) AI.promote(g, p);
    g.startTurn(); AI.resolvePending(g); if (g.winner != null) return;
    if (!pl.active && (pl.bench.length || pl.hand.length)) AI.promote(g, p);
    if (!pl.active) { g.endTurn(); return; }
    // bench everyone we can
    while (pl.hand.length && pl.bench.length < g.rules.benchMax) {
      const m = pl.hand.slice().sort((a, b) => (b.card.habitat === g.place.water) - (a.card.habitat === g.place.water) || AI.value(b.card) - AI.value(a.card))[0];
      g.benchFromHand(m.uid);
    }
    if (style === 'random') return AI.randomTurn(g);
    // retreat if the Active is about to be washed out (or cannot be hurt by... ) and a better one waits
    const me = pl.active;
    if (me && g.canRetreat()) {
      const danger = AI.threat(g, me, opp) >= me.card.hp - me.dmg;
      const better = pl.bench.slice().sort((a, b) => (b.card.hp - b.dmg + 10 * b.nut) - (a.card.hp - a.dmg + 10 * a.nut))[0];
      const hunterVsMe = opp.active && opp.active.card.lifestyle === 'hunter' && me.card.weak === 'hunt';
      const immuneSub = pl.bench.find(b => opp.active && opp.active.card.lifestyle === 'hunter' && b.card.immune.includes('hunt'));
      if (hunterVsMe && immuneSub) g.retreat(immuneSub.uid);
      else if (danger && better && better.card.hp - better.dmg > me.card.hp - me.dmg && !AI.bestAttack(g, me, opp)?.ko) g.retreat(better.uid);
    }
    // events: play the one that helps most
    if (style !== 'noevents') AI.playEvents(g);
    AI.resolvePending(g); if (g.winner != null) return;
    // feed: the Active until it can use its big attack, else the bench microbe closest to ready
    const act = pl.active;
    if (act && (style === 'rush' || style === 'activeonly')) g.feed(act.uid);
    else if (act) {
      const need = Math.max(...act.card.attacks.map(a => a.cost));
      const target = act.nut < need ? act : (pl.bench.slice().sort((a, b) => (g.isHome(b) - g.isHome(a)) || (b.card.hp - b.dmg) - (a.card.hp - a.dmg))[0] || act);
      g.feed(target.uid);
    }
    // attack
    if (pl.active && g.turn > 1) {
      const b = style === 'rush' ? AI.cheapestAttack(g, pl.active, opp) : AI.bestAttack(g, pl.active, opp);
      if (b) { g.attack(b.idx, b.target); AI.afterAttack(g); }
    }
    AI.resolvePending(g);
    if (g.winner == null) g.endTurn();
  },
  afterAttack(g) {
    const pl = g.players[g.cur], me = pl.active;
    if (me && me.card.attacks.some(a => a.effect?.type === 'freeSwitch') && pl.bench.length && me.dmg >= me.card.hp / 2) {
      const b = pl.bench.slice().sort((a, b) => (b.card.hp - b.dmg) - (a.card.hp - a.dmg))[0];
      g.retreat(b.uid, true);
    }
  },
  playEvents(g) {
    const pl = g.players[g.cur], opp = g.rival(g.cur), me = pl.active;
    const opts = [];
    for (const id of new Set(pl.events)) {
      let v = 0, target = null;
      const all = [...g.inPlay(pl), ...g.inPlay(opp)];
      if (id === 'phage' && all.length) {
        const left = m => m.card.hp - m.dmg, max = Math.max(...all.map(left));
        const tied = all.filter(m => left(m) === max); const v0 = tied.find(m => m.owner !== g.cur) || tied[0];
        v = v0.owner !== g.cur ? 20 + (v0.dmg + 20 >= v0.card.hp ? 60 : 0) : -20; target = v0.uid;
      } else if (id === 'grazer' && opp.active) { v = opp.active.card.badges.includes('tiny') ? -1 : 30 + (opp.active.dmg + 30 >= opp.active.card.hp ? 60 : 0); }
      else if (id === 'freeze') { v = (opp.active && !opp.active.card.badges.includes('cold') ? 20 : 0) - (me && !me.card.badges.includes('cold') ? 20 : 0); }
      else if (id === 'midnightsun') { v = 12 * Math.min(2, g.inPlay(pl).filter(m => m.card.badges.includes('sun')).length); }
      else if (id === 'bloom' || id === 'stirup') { const want = id === 'bloom' ? 'recycler' : 'chem'; const m = g.inPlay(pl).find(x => x.card.lifestyle === want) || me; if (m) { v = m.card.lifestyle === want ? 22 : 10; target = m.uid; } }
      else if (id === 'spill') { v = 24 * g.inPlay(pl).filter(m => m.card.lifestyle === 'oil').length + (opp.active && opp.active.card.lifestyle !== 'oil' ? 10 : 0) - (me && me.card.lifestyle !== 'oil' ? 10 : 0); }
      else if (id === 'tide' && opp.bench.length && opp.active?.card.ability?.key !== 'hold') {
        const weakest = opp.bench.slice().sort((a, b) => (a.card.hp - a.dmg) - (b.card.hp - b.dmg))[0];
        if (me) { const d = Math.max(0, ...me.card.attacks.filter(a => me.nut + 1 >= a.cost).map(a => g.calcDamage(me, a, weakest))); v = d >= weakest.card.hp - weakest.dmg ? 70 : 0; }
        target = weakest.uid;
      }
      else if (id === 'hgt' && me && pl.bench.length) { const best = Math.max(0, ...pl.bench.flatMap(b => b.card.attacks.filter(a => me.nut + 1 >= a.cost).map(a => opp.active ? g.calcDamage(me, a, opp.active) : 0))); const own = AI.bestAttack(g, me, opp)?.d || 0; v = best - own - 5; }
      else if (id === 'b12') { const m = g.inPlay(pl).sort((a, b) => b.dmg - a.dmg)[0]; if (m && m.dmg >= 20) { v = Math.min(30, m.dmg); target = m.uid; } }
      else if (id === 'seedbank') { const m = me; if (m && m.dmg >= m.card.hp - 20 && pl.bench.length && m.nut <= 1) { v = 25; target = m.uid; } }
      else if (id === 'trip') { const ch = g.placeChoices(3); if (ch.length) { const best = AI.choosePlace(g, g.cur, ch.concat([g.place])); v = best === g.place ? -1 : 14; target = best.id; } }
      if (v > 0) opts.push({id, v, target});
    }
    opts.sort((a, b) => b.v - a.v);
    if (opts[0]) g.playEvent(opts[0].id, opts[0].target);
  },
  randomTurn(g) {
    const pl = g.players[g.cur], opp = g.rival(g.cur), r = g.r;
    if (pl.events.length && r() < 0.5) { const id = pl.events[Math.floor(r() * pl.events.length)]; const t = g.eventTargets(id) || []; g.playEvent(id, t.length ? (t[Math.floor(r() * t.length)].uid ?? t[0].id) : null); }
    AI.resolvePending(g); if (g.winner != null) return;
    const all = g.inPlay(pl); if (all.length) g.feed(all[Math.floor(r() * all.length)].uid);
    if (pl.active && g.turn > 1) {
      const ok = g.attacksFor(pl.active).map((c, i) => [c, i]).filter(([c]) => pl.active.nut >= c.a.cost);
      if (ok.length) { const [c, i] = ok[Math.floor(r() * ok.length)]; const ts = c.a.effect?.type === 'snipe' ? g.inPlay(opp) : [opp.active]; g.attack(i, ts[Math.floor(r() * ts.length)]?.uid); }
    }
    AI.resolvePending(g);
    if (g.winner == null) g.endTurn();
  },
  setup(g, p) {
    const pl = g.players[p], opp = g.rival(p);
    const ranked = pl.hand.slice().sort((a, b) => (b.card.habitat === g.place.water) - (a.card.habitat === g.place.water) || AI.value(b.card) - AI.value(a.card));
    g.setup(p, ranked[0].uid, ranked.slice(1, 1 + g.rules.benchMax).map(m => m.uid));
  },
};

// play a whole game between two computer players; returns {winner, turns, game}
function playout(deck, teams, {seed = 1, first = 0, styles = ['greedy', 'greedy'], maxTurns = 80, rules} = {}) {
  const g = new Game(deck, teams, {seed, first, rules});
  AI.setup(g, 0); AI.setup(g, 1);
  while (g.winner == null && g.turn < maxTurns) AI.turn(g, styles[g.cur]);
  return {winner: g.winner, turns: g.turn, game: g};
}
// snake draft from a face-up pool: A, B, B, A, A, B, B, A, ...
function draft(deck, {seed = 1, pool = 10, styles = ['greedy', 'greedy'], teamSize = T.teamSize} = {}) {
  const r = rng(seed * 7919 + 13);
  let left = shuffle(deck.microbes, r).slice(0, pool);
  const teams = [[], []];
  const order = []; for (let i = 0; order.length < teamSize * 2; i++) order.push([0, 1, 1, 0][i % 4]);
  order.forEach(p => { const c = AI.draft(left, teams[p], teams[1 - p], r, styles[p]); teams[p].push(c); left = left.filter(x => x !== c); });
  return teams.map(t => t.map(c => c.id));
}

const API = {Game, AI, playout, draft, rng, shuffle};
root.MicrobeGame = API;
if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
