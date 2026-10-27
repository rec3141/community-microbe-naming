#!/usr/bin/env node
// Balance check for the microbe card game (docs/card_game.md). Builds the deck from a
// community's data exactly as cards.html does, then plays many computer-vs-computer games.
//   node scripts/build/card_sim.js [community-id] [games] [--tune key=value ...]
// Reports: game length, first-player edge, win rate per card and per type, and
// strategy match-ups (greedy vs random play, drafted vs random teams).
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const args = process.argv.slice(2);
const ID = args[0] && !args[0].startsWith('--') ? args[0] : 'igluligaarjuk';
const N = +(args[1] && !args[1].startsWith('--') ? args[1] : 4000);
global.window = global;
for (const f of ['community.js', 'candidates.js', 'narratives.js', 'site_data.js']) require(path.join(ROOT, 'communities', ID, f));
require(path.join(ROOT, 'site/explain/guilds.js'));
const MC = require(path.join(ROOT, 'site/cards/engine.js'));
args.forEach((a, i) => { if (a === '--tune') { const [k, v] = args[i + 1].split('='); MC.TUNE[k] = JSON.parse(v); } });
const MG = require(path.join(ROOT, 'site/cards/game.js'));
const deck = MC.buildDeck({candidates: window.CANDIDATES, narratives: window.NARRATIVES, data: window.EXTRA_SITE_DATA, community: window.COMMUNITY});
const byId = Object.fromEntries(deck.microbes.map(c => [c.id, c]));
const pct = x => (100 * x).toFixed(1).padStart(5) + '%';
const median = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

function run(label, {styles = ['greedy', 'greedy'], draftStyles = ['greedy', 'greedy'], teamFn = null, n = N} = {}) {
  const res = {wins: [0, 0], draws: 0, first: 0, comeback: 0, turns: [], card: {}, life: {}, n};
  for (let s = 1; s <= n; s++) {
    const teams = teamFn ? teamFn(s) : MG.draft(deck, {seed: s, styles: draftStyles});
    const first = s % 2;
    const {winner, turns, game} = MG.playout(deck, teams, {seed: s, first, styles});
    res.turns.push(turns);
    if (winner == null) { res.draws++; continue; }
    if (game.firstLoss === winner) res.comeback++;
    if (game.stats) { res.a1 = (res.a1 || 0) + game.stats.a1; res.a2 = (res.a2 || 0) + game.stats.a2; }
    res.wins[winner]++; if (winner === first) res.first++;
    teams.forEach((t, p) => t.forEach(id => {
      const c = res.card[id] = res.card[id] || {g: 0, w: 0}; c.g++; if (winner === p) c.w++;
      const L = byId[id].lifestyle, l = res.life[L] = res.life[L] || {g: 0, w: 0}; l.g++; if (winner === p) l.w++;
    }));
  }
  const decided = n - res.draws;
  console.log(`\n== ${label} (${n} games)`);
  console.log(`  player 1 wins ${pct(res.wins[0] / n)}, player 2 ${pct(res.wins[1] / n)}, unfinished after 80 turns ${pct(res.draws / n)}; first player wins ${pct(res.first / Math.max(1, decided))} of decided games`);
  const t = res.turns;
  if (res.a1 != null) console.log(`  quick attacks are ${pct(res.a1 / (res.a1 + res.a2))} of all attacks`);
  console.log(`  the player who lost the first microbe still won ${pct(res.comeback / Math.max(1, decided))} of games`);
  console.log(`  turns per game: median ${median(t)}, 10th pct ${t.slice().sort((a, b) => a - b)[Math.floor(t.length * .1)]}, 90th pct ${t.slice().sort((a, b) => a - b)[Math.floor(t.length * .9)]}`);
  return res;
}
function table(res, title) {
  console.log(`  ${title}`);
  Object.entries(res.life).sort((a, b) => b[1].w / b[1].g - a[1].w / a[1].g).forEach(([k, v]) => console.log(`    ${k.padEnd(9)} ${pct(v.w / v.g)} of ${v.g} team slots`));
  const rows = Object.entries(res.card).map(([id, v]) => [byId[id], v.w / v.g, v.g]).sort((a, b) => b[1] - a[1]);
  rows.forEach(([c, w, g]) => console.log(`    ${String(c.num).padStart(2)} ${c.name.padEnd(32)} ${c.lifestyle.padEnd(8)} HP${String(c.hp).padStart(3)} ${c.attacks.map(a => a.cost + '●' + a.dmg).join(' ')}  win ${pct(w)}  (${g} games)`));
  const ws = rows.map(r => r[1]);
  console.log(`    spread of card win rates: ${pct(Math.min(...ws))} to ${pct(Math.max(...ws))}`);
}

// 1. random teams of 5, both greedy: measures each card's own strength
const randTeams = s => { const r = MG.rng(s * 31 + 7); const sh = MG.shuffle(deck.microbes, r); return [sh.slice(0, 5).map(c => c.id), sh.slice(5, 10).map(c => c.id)]; };
table(run('random teams, greedy play', {teamFn: randTeams}), 'win rate when on a team:');
// 2. drafted teams (greedy draft from 10 face-up cards)
table(run('greedy draft, greedy play'), 'win rate when drafted:');
// 3. strategy checks
run('greedy draft: greedy player vs random player', {styles: ['greedy', 'random']});
run('greedy drafter vs random drafter (both play greedy)', {draftStyles: ['greedy', 'random']});
run('plays events vs never plays events', {styles: ['greedy', 'noevents']});
run('greedy vs only ever uses the quick attack', {styles: ['greedy', 'rush']});
run('greedy vs only ever feeds its Active', {styles: ['greedy', 'activeonly']});
// 4. one-trick teams: all the hunters, all the Gram-positives, etc. against random teams
const groups = {hunters: c => c.lifestyle === 'hunter', 'Gram-pos/waxy/archaea': c => c.immune.includes('hunt'), marine: c => c.habitat === 'marine', freshwater: c => c.habitat === 'freshwater', 'top HP': null};
for (const [g, fn] of Object.entries(groups)) {
  const pick = fn ? deck.microbes.filter(fn) : deck.microbes.slice().sort((a, b) => b.hp - a.hp);
  const res = run(`stacked team "${g}" (player 1) vs random teams`, {n: Math.round(N / 4), teamFn: s => {
    const r = MG.rng(s * 17 + 3), mine = MG.shuffle(pick, r).slice(0, 5);
    // groups smaller than a team are filled up with random microbes
    mine.push(...MG.shuffle(deck.microbes.filter(c => !mine.includes(c)), r).slice(0, 5 - mine.length));
    const rest = MG.shuffle(deck.microbes.filter(c => !mine.includes(c)), r).slice(0, 5);
    return [mine.map(c => c.id), rest.map(c => c.id)];
  }});
}
