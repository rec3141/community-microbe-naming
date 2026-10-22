// On-screen game for cards.html: 2 players on one device (hot-seat) or 1 player vs the computer.
// Uses the same rules engine (game.js) as the printed rules and the balance simulator.
(function () {
'use strict';
const MG = window.MicrobeGame, MC = window.MicrobeCards, R = window.MicrobeRender;
const esc = R.esc;
let DECK = null, g = null, S = null;  // S: UI state
const root = () => document.getElementById('play');

function open(deck) {
  DECK = deck;
  if (!g && !S) menu();
}

function menu() {
  g = null; S = null;
  root().innerHTML = `<div class="panel"><h2>Play on screen</h2>
    <p>Play against the computer, or pass one device between two players. The computer follows the same rules as the printed cards. New here? Read the <a href="#rules">rules</a> first; the game tells you what you can do at each step.</p>
    <p><button class="btn primary" data-go="cpu">🤖 Play vs computer</button> <button class="btn" data-go="hot">👥 2 players, one device</button>
    <label class="note" style="margin-left:10px"><input type="checkbox" id="quickDeal"> Skip the draft (deal 5 each)</label></p></div>`;
  root().querySelectorAll('[data-go]').forEach(b => b.onclick = () => startDraft(b.dataset.go, document.getElementById('quickDeal').checked));
}

// ---------- draft ----------
function startDraft(mode, quick) {
  const seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
  const r = MG.rng(seed);
  S = {mode, human: [true, mode === 'hot'], seed, r, pool: MG.shuffle(DECK.microbes, r).slice(0, 10), teams: [[], []], order: [0, 1, 1, 0, 0, 1, 1, 0, 0, 1], pick: 0, sel: null, msg: '', target: null};
  if (quick) { S.teams = [S.pool.slice(0, 5), S.pool.slice(5, 10)]; S.pool = []; return startSetup(); }
  draftStep();
}
const who = p => S.mode === 'cpu' ? (p === 0 ? 'You' : 'Computer') : `Player ${p + 1}`;
function draftStep() {
  if (S.pick >= S.order.length || !S.pool.length) return startSetup();
  const p = S.order[S.pick], human = S.human[p];
  const team = t => t.map(c => `<div class="slot small" title="${esc(c.name)}">${R.face(c, 0)}</div>`).join('') || '<span class="note">none yet</span>';
  root().innerHTML = `<div class="panel"><h2>Draft: ${human ? `${who(p)} pick${S.mode === 'cpu' ? '' : 's'} a microbe` : 'the computer is picking…'}</h2>
    <p class="note">Picking order: A, B, B, A, A, B, B, A, A, B. Tip: Hunters (🎯) beat Gram-negative microbes, but Gram-positive ones and archaea can't be hunted. Tap a card's ⓘ to read it.</p>
    <div class="draftpool">${S.pool.map(c => `<div class="slot${human ? ' pick' : ''}" data-id="${esc(c.id)}">${R.face(c, 0)}<button class="btn" style="position:absolute;top:4px;right:4px;padding:1px 7px" data-info="${esc(c.id)}">ⓘ</button></div>`).join('')}</div></div>
    <div class="panel"><h3>${who(0)}</h3><div class="row">${team(S.teams[0])}</div><h3>${who(1)}</h3><div class="row">${team(S.teams[1])}</div></div>`;
  root().querySelectorAll('[data-info]').forEach(b => b.onclick = e => { e.stopPropagation(); window.openBigCard(b.dataset.info); });
  const take = c => { if (!c || S.order[S.pick] !== p) return; S.teams[p].push(c); S.pool = S.pool.filter(x => x !== c); S.pick++; draftStep(); };
  if (!human) return setTimeout(() => take(MG.AI.draft(S.pool, S.teams[p], S.teams[1 - p], S.r)), 450);
  root().querySelectorAll('.draftpool .slot.pick').forEach(el => el.onclick = () => take(S.pool.find(x => x.id === el.dataset.id)));
}

// ---------- setup ----------
function startSetup() {
  const first = S.r() < 0.5 ? 0 : 1;
  g = new MG.Game(DECK, S.teams.map(t => t.map(c => c.id)), {seed: S.seed, first});
  g.human = S.human;
  S.first = first; S.setupFor = 0;
  setupStep();
}
function setupStep() {
  const p = S.setupFor;
  if (p > 1) { S.msg = `${who(g.cur)} ${S.mode === 'cpu' && g.cur === 0 ? 'go' : 'goes'} first (coin flip) but cannot attack this turn.`; return beginTurn(); }
  if (!S.human[p]) { MG.AI.setup(g, p); S.setupFor++; return setupStep(); }
  const pl = g.players[p];
  const place = g.place;
  cover(S.mode === 'hot' ? `${who(p)}: set up your microbes` : null, () => {
    root().innerHTML = `<div class="panel"><h2>${who(p)}: choose your Active microbe</h2>
      <p>The first Place is <b>${esc(place.name)}</b> (${place.water === 'marine' ? 'salt water' : 'fresh water'}, ${esc(place.season)}). Microbes from the wrong kind of water lose 10 HP at the start of each of your turns while Active. The others go on your Bench (up to 3).</p>
      <div class="row">${placeSlot()}</div>
      <div class="draftpool">${pl.hand.map(m => `<div class="slot pick" data-uid="${m.uid}">${R.face(m.card, 0)}</div>`).join('')}</div></div>`;
    root().querySelectorAll('[data-uid]').forEach(el => el.onclick = () => {
      const uid = +el.dataset.uid;
      g.setup(p, uid, pl.hand.filter(m => m.uid !== uid).slice(0, g.rules.benchMax).map(m => m.uid));
      S.setupFor++; setupStep();
    });
  });
}

// hot-seat: hide the screen between players so hands stay secret
function cover(title, then) {
  if (!title) return then();
  const d = document.createElement('div'); d.className = 'cover';
  d.innerHTML = `<h2>${esc(title)}</h2><p class="note">Pass the device. The other player should look away.</p><button class="btn primary">I'm ready</button>`;
  document.body.appendChild(d);
  d.querySelector('button').onclick = () => { d.remove(); then(); };
}

// ---------- turns ----------
function beginTurn() {
  if (g.winner != null) return render();
  const p = g.cur;
  if (!S.human[p]) {
    render();
    return setTimeout(() => {
      MG.AI.turn(g);
      S.msg = ''; S.lastCpuLog = g.log.length;
      if (g.winner != null) return render();
      beginTurn();
    }, 700);
  }
  cover(S.mode === 'hot' ? `${who(p)}'s turn` : null, () => {
    S.started = false; S.sel = null; S.target = null;
    preTurn();
  });
}
// forced choices first (new Active, next Place), then the turn starts
function preTurn() {
  const p = g.cur, pl = g.players[p];
  if (g.pendingPlace === p && g.placeChoices(2).length) { S.target = {type: 'place', choices: g.placeChoices(2)}; S.msg = 'One of your microbes was washed out: choose the next Place.'; return render(); }
  if (g.pendingPlace === p) g.pendingPlace = null;
  if (!pl.active && (pl.bench.length || pl.hand.length)) { S.target = {type: 'promote'}; S.msg = 'Choose your new Active microbe.'; return render(); }
  g.pendingPromote = g.pendingPromote === p ? null : g.pendingPromote;
  if (!S.started) {
    S.started = true; g.startTurn();
    if (g.winner != null) return render();
    if (!pl.active || g.pendingPlace === p) return preTurn();
    S.msg = S.msg || 'Feed one of your microbes, then attack.';
  }
  render();
}
function after() {  // after any action: resolve the computer's forced choices, check for a winner
  MG.AI.resolvePending(g);
  if (g.winner != null) return render();
  const p = g.cur, pl = g.players[p];
  if (!pl.active && (pl.bench.length || pl.hand.length)) { S.target = {type: 'promote'}; S.msg = 'Your Active was washed out. Choose a new one.'; }
  else if (g.pendingPlace === p && g.placeChoices(2).length) { S.target = {type: 'place', choices: g.placeChoices(2)}; S.msg = 'Choose the next Place.'; }
  render();
}
function endTurn() {
  S.target = null; S.sel = null; S.msg = '';
  g.endTurn(); beginTurn();
}

// ---------- rendering ----------
function slot(m, {small = false, cls = ''} = {}) {
  if (!m) return '<div class="slot"><div class="note" style="width:52mm;height:72mm;border:1px dashed var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center">empty</div></div>';
  const left = m.card.hp - m.dmg;
  return `<div class="slot${small ? ' small' : ''} ${cls}" data-uid="${m.uid}">${R.face(m.card, 0)}
    <div class="counter"><span class="d" title="HP left">❤ ${left}</span><span class="n" title="nutrients">● ${m.nut}</span></div></div>`;
}
function placeSlot() { return `<div class="slot small" data-place="1">${R.face(g.place, 0)}</div>`; }

function render() {
  const el = root(); if (!g) return;
  const me = g.cur, viewer = S.mode === 'cpu' ? 0 : me;
  const pv = g.players[viewer], po = g.players[1 - viewer];
  const myTurn = S.human[me] && g.winner == null;
  const T = S.target;
  const pickable = m => {
    if (!T || !myTurn) return false;
    if (T.type === 'promote') return m.owner === me && !g.players[me].active;
    if (T.type === 'event') return T.targets.some(t => t.uid === m.uid);
    if (T.type === 'snipe') return m.owner !== me;
    if (T.type === 'switch') return m.owner === me && g.players[me].bench.includes(m);
    return false;
  };
  const cls = m => (pickable(m) ? 'pick' : '') + (S.sel === m.uid ? ' sel' : '');
  const side = (pl, mine) => {
    const label = who(pl.p), isTurn = g.cur === pl.p;
    return `<div class="side-area${isTurn ? ' me' : ''}"><h3>${label}${isTurn ? ' ◀ turn' : ''} <span class="score">washed out ${pl.score}/${g.rules.winScore}</span>
      <span class="note">hand: ${pl.hand.length} microbe${pl.hand.length === 1 ? '' : 's'}, ${pl.events.length} event${pl.events.length === 1 ? '' : 's'}</span></h3>
      <div class="row">${slot(pl.active, {cls: pl.active ? cls(pl.active) : ''})}<div class="row">${pl.bench.map(m => slot(m, {small: true, cls: cls(m)})).join('')}</div>
      ${mine && pl.hand.length ? `<div><div class="note">In hand (tap to bench or make Active):</div><div class="row">${pl.hand.map(m => slot(m, {small: true, cls: (T?.type === 'promote' ? 'pick' : '') + ' hand'})).join('')}</div></div>` : ''}</div>
      ${mine ? `<div class="note" style="margin-top:6px">Your events (tap to play one per turn):</div><div class="hand-ev">${pl.events.map((id, i) => `<div class="slot small${S.ev === i ? ' sel' : ''}" data-ev="${i}">${R.face(g.ev[id], 0)}</div>`).join('') || '<span class="note">none</span>'}</div>` : ''}
    </div>`;
  };
  const actions = () => {
    if (g.winner != null) return `<div class="prompt" style="border-color:var(--gold);color:var(--gold)">🏆 ${who(g.winner)} ${S.mode === 'cpu' && g.winner === 0 ? 'win' : 'wins'}! <button class="btn primary" data-act="again">Play again</button></div>`;
    if (!myTurn) return `<div class="prompt">The computer is thinking…</div>`;
    if (T?.type === 'place') return `<div class="prompt">${esc(S.msg)}</div><div class="row">${T.choices.map(p => `<div class="slot small pick" data-pick-place="${esc(p.id)}">${R.face(p, 0)}</div>`).join('')}</div>`;
    const pl = g.players[me], a = pl.active;
    const selM = g.inPlay(pl).find(m => m.uid === S.sel);
    let btns = '';
    if (a && !T) {
      btns += g.attacksFor(a).map((ch, i) => {
        const ok = !g.t.attacked && g.turn > 1 && a.nut >= ch.a.cost && g.players[1 - me].active;
        const d = g.players[1 - me].active ? g.calcDamage(a, ch.a, g.players[1 - me].active) : 0;
        return `<button class="btn${ok ? ' primary' : ''}" data-atk="${i}" ${ok ? '' : 'disabled'} title="${esc(ch.a.text || '')}">⚔ ${esc(ch.a.name)}${ch.borrowed ? ' (borrowed)' : ''} · ${'●'.repeat(ch.a.cost)} · ${ch.a.effect?.type === 'snipe' ? 'pick a target' : d + ' dmg'}</button>`;
      }).join(' ');
      btns += ` <button class="btn" data-act="feed" ${selM && g.canFeed() ? '' : 'disabled'}>🍽️ Feed ${selM ? esc(selM.card.name.split(' ').pop()) : '(tap a microbe)'}${selM && g.isHome(selM) ? ' +2' : ''}</button>`;
      btns += ` <button class="btn" data-act="retreat" ${selM && pl.bench.includes(selM) && g.canRetreat() ? '' : 'disabled'}>↩ Retreat (cost ${a.card.retreat}) to selected</button>`;
      btns += ` <button class="btn" data-act="end">End turn ⏭</button>`;
    }
    if (T && T.type !== 'promote') btns += ` <button class="btn" data-act="cancel">Cancel</button>`;
    return `${S.msg ? `<div class="prompt">${esc(S.msg)}</div>` : ''}<div class="actions">${btns}</div>`;
  };
  const logStart = Math.max(0, g.log.length - 60);
  el.innerHTML = `<div class="board">
    ${side(po, S.mode === 'hot' ? false : false)}
    <div class="mid"><div><div class="note">Place now:</div>${placeSlot()}<div class="note">${g.placeDeck.length} more places · ${g.eventDeck.length} events in the pile</div></div>
      <div class="log" id="gameLog">${g.log.slice(logStart).map(l => `<div>${esc(l)}</div>`).join('')}</div></div>
    ${actions()}
    ${side(pv, true)}
    <p class="note"><button class="btn" data-act="quit">Quit game</button> Tap a rival's card or the Place to read it big.</p>
  </div>`;
  const lg = document.getElementById('gameLog'); if (lg) lg.scrollTop = lg.scrollHeight;
  wire();
}

function wire() {
  const el = root(), me = g.cur, pl = g.players[me];
  el.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
    const a = b.dataset.act;
    if (a === 'again' || a === 'quit') { g = null; S = null; return menu(); }
    if (a === 'end') return endTurn();
    if (a === 'cancel') { S.target = null; S.ev = null; S.msg = ''; return render(); }
    if (a === 'feed') { g.feed(S.sel); S.msg = ''; return after(); }
    if (a === 'retreat') { g.retreat(S.sel); S.sel = null; return after(); }
  });
  el.querySelectorAll('[data-atk]').forEach(b => b.onclick = () => {
    const i = +b.dataset.atk, ch = g.attacksFor(pl.active)[i];
    if (ch.a.effect?.type === 'snipe') { S.target = {type: 'snipe', idx: i}; S.msg = 'Choose which rival microbe to hit.'; return render(); }
    doAttack(i, null);
  });
  el.querySelectorAll('[data-pick-place]').forEach(b => b.onclick = () => { g.setPlace(b.dataset.pickPlace); S.target = null; S.msg = ''; preTurnOrAfter(); });
  el.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => playEventUI(+b.dataset.ev));
  el.querySelectorAll('.slot[data-uid]').forEach(s => s.onclick = () => clickMicrobe(+s.dataset.uid));
  el.querySelectorAll('.slot[data-place]').forEach(s => s.onclick = () => window.openBigCard(g.place.id));
}
function preTurnOrAfter() { if (!S.started) preTurn(); else after(); }

function findM(uid) { for (const p of g.players) for (const m of [p.active, ...p.bench, ...p.hand]) if (m && m.uid === uid) return m; return null; }
function clickMicrobe(uid) {
  const me = g.cur, pl = g.players[me], m = findM(uid), T = S.target;
  if (!m || !S.human[me] || g.winner != null) { if (m) window.openBigCard(m.card.id); return; }
  if (T?.type === 'promote') {
    if (m.owner === me && (pl.bench.includes(m) || pl.hand.includes(m))) { g.promote(me, uid); S.target = null; S.msg = ''; return preTurnOrAfter(); }
    return;
  }
  if (T?.type === 'event') {
    if (T.targets.some(t => t.uid === uid)) { const id = pl.events[T.i]; S.target = null; S.ev = null; if (!g.playEvent(id, uid)) S.msg = 'That event can’t be played on that microbe.'; else S.msg = ''; return after(); }
    return;
  }
  if (T?.type === 'snipe') { if (m.owner !== me) { S.target = null; doAttack(T.idx, uid); } return; }
  if (T?.type === 'switch') {
    if (pl.bench.includes(m)) { g.retreat(uid, true); S.target = null; return endTurn(); }
    return;
  }
  if (m.owner !== me) return window.openBigCard(m.card.id);
  if (pl.hand.includes(m)) {
    if (pl.bench.length < g.rules.benchMax || !pl.active) { g.benchFromHand(uid); return after(); }
    S.msg = 'Your bench is full (3).'; return render();
  }
  S.sel = S.sel === uid ? null : uid; S.msg = S.sel ? `Selected ${m.card.name}. Feed it${pl.bench.includes(m) ? ', or retreat your Active to bring it forward' : ''}.` : '';
  render();
}
function doAttack(i, target) {
  const pl = g.players[g.cur], me = pl.active, ch = g.attacksFor(me)[i];
  if (!g.attack(i, target)) { S.msg = 'You can’t use that attack now.'; return render(); }
  MG.AI.resolvePending(g);
  if (g.winner != null) return render();
  if (ch.a.effect?.type === 'freeSwitch' && pl.active === me && pl.bench.length) { S.target = {type: 'switch'}; S.msg = 'You may switch your Active with a Bench microbe for free: tap one, or end your turn.'; return render(); }
  if (!pl.active && (pl.bench.length || pl.hand.length)) return after();
  endTurn();
}
function playEventUI(i) {
  const pl = g.players[g.cur], id = pl.events[i], e = g.ev[id];
  if (g.t.event) { S.msg = 'You have already played an event this turn.'; return render(); }
  if (id === 'trip') { const ch = g.placeChoices(3); S.target = {type: 'tripPick'}; if (!ch.length) return; S.msg = 'Field Trip: choose a Place.';
    const el = root(); render();
    el.querySelector('.actions').insertAdjacentHTML('beforebegin', `<div class="row">${ch.map(p => `<div class="slot small pick" data-trip="${esc(p.id)}">${R.face(p, 0)}</div>`).join('')}</div>`);
    el.querySelectorAll('[data-trip]').forEach(b => b.onclick = () => { g.playEvent('trip', b.dataset.trip); S.target = null; S.msg = ''; after(); });
    return;
  }
  const targets = g.eventTargets(id) || [];
  const needs = ['bloom', 'stirup', 'b12', 'seedbank', 'tide'].includes(id);
  if (needs) {
    if (!targets.length) { S.msg = `${e.name} has nothing to target right now.`; return render(); }
    S.target = {type: 'event', i, targets}; S.ev = i; S.msg = `${e.name}: choose a microbe. ${e.text}`; return render();
  }
  if (!g.playEvent(id, null)) S.msg = `${e.name} can’t be played right now.`; else S.msg = '';
  after();
}

window.MicrobePlay = {open};
})();
