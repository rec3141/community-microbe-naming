// On-screen game for cards.html: 2 players on one device (hot-seat) or 1 player vs the computer.
// Uses the same rules engine (game.js) as the printed rules and the balance simulator.
// UI rules: tapping a card only enlarges it (never a move). Moves are buttons under each card.
// Every move is two steps: choose it, read the preview (worked out by trying it on a copy of
// the game), then Confirm or Cancel. The computer's turn is replayed one step at a time.
(function () {
'use strict';
const MG = window.MicrobeGame, MC = window.MicrobeCards, R = window.MicrobeRender;
const esc = R.esc;
let DECK = null, g = null, S = null;
const root = () => document.getElementById('play');

function open(deck) { DECK = deck; ensureBar(); if (!S) menu(); }

// ---------- confirm bar (in-page, fixed to the bottom of the screen) ----------
function ensureBar() {
  if (document.getElementById('askBar')) return;
  const b = document.createElement('div'); b.id = 'askBar'; b.className = 'askbar hidden';
  document.body.appendChild(b);
  b.addEventListener('click', e => {
    const k = e.target.closest('[data-ask]'); if (!k || !S || !S.ask) return;
    const run = S.ask.run; S.ask = null; drawBar();
    if (k.dataset.ask === 'ok') run(); else render();
  });
}
// propose a move: title, preview lines, and what to do on Confirm
function ask(title, lines, run, okLabel = 'Confirm') { S.ask = {title, lines: lines.filter(Boolean), run, okLabel}; drawBar(); }
function drawBar() {
  const b = document.getElementById('askBar'); if (!b) return;
  const A = S && S.ask;
  b.classList.toggle('hidden', !A); document.body.classList.toggle('asking', !!A);
  if (!A) { b.innerHTML = ''; return; }
  b.innerHTML = `<div class="ask-in"><div class="ask-t"><b>${esc(A.title)}</b>${A.lines.length ? `<ul>${A.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}</div>
    <div class="ask-b"><button class="btn primary" data-ask="ok">✔ ${esc(A.okLabel)}</button><button class="btn" data-ask="no">✕ Cancel</button></div></div>`;
}
// what a move would do: try it on a copy of the game and read the copy's log
function preview(fn) {
  const c = g.clone(); fn(c);
  return c.log.filter(l => !/Mystery Genes coin/.test(l));
}

function menu() {
  g = null; S = null; drawBar();
  root().innerHTML = `<div class="panel"><h2>Play on screen</h2>
    <p>Play against the computer, or pass one device between two players. The computer follows the same rules as the printed cards. New here? Read the <a href="#rules">rules</a> first.</p>
    <p class="note">Tap any card to see it big. Your moves appear as buttons under your cards; nothing happens until you press <b>Confirm</b>.</p>
    <p><button class="btn primary" data-go="cpu">🤖 Play vs computer</button> <button class="btn" data-go="hot">👥 2 players, one device</button>
    <label class="note" style="margin-left:10px"><input type="checkbox" id="quickDeal"> Skip the draft (deal 5 each)</label></p></div>`;
  root().querySelectorAll('[data-go]').forEach(b => b.onclick = () => start(b.dataset.go, document.getElementById('quickDeal').checked));
}

function start(mode, quick) {
  const seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0, r = MG.rng(seed);
  S = {mode, human: [true, mode === 'hot'], seed, r, phase: 'draft', pool: MG.shuffle(DECK.microbes, r).slice(0, 10), teams: [[], []],
    order: [0, 1, 1, 0, 0, 1, 1, 0, 0, 1], pick: 0, msg: '', ask: null, target: null, choice: null, replay: null, auto: false};
  S.names = mode === 'cpu' ? ['You', 'Computer'] : ['Player 1', 'Player 2'];
  if (quick) { S.teams = [S.pool.slice(0, 5), S.pool.slice(5, 10)]; S.pool = []; return startSetup(); }
  draftStep();
}
const who = p => S.names[p];

// ---------- card slots with their moves ----------
// moves: [{label, why (reason it is greyed out), act}]
function slotHTML(card, {inst = null, moves = [], small = false, cls = '', badge = ''} = {}) {
  const key = S.moves.length;
  moves.forEach(m => S.moves.push(m));
  const cnt = inst ? `<div class="counter"><span class="d" title="HP left">❤ ${inst.card.hp - inst.dmg}</span><span class="n" title="nutrients">● ${inst.nut}</span></div>` : '';
  return `<div class="slot${small ? ' small' : ''} ${cls}" data-cid="${esc(card.id)}"${inst ? ` data-uid="${inst.uid}"` : ''}>
    ${badge ? `<div class="newtag">${esc(badge)}</div>` : ''}${R.face(card, 0)}${cnt}
    ${moves.length ? `<div class="moves">${moves.map((m, i) => `<button class="mv${m.primary ? ' primary' : ''}" data-mv="${key + i}" ${m.why ? 'disabled' : ''}>${esc(m.label)}${m.why ? `<small>${esc(m.why)}</small>` : ''}</button>`).join('')}</div>` : ''}
  </div>`;
}
function wireCommon(view) {
  const el = root();
  el.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => { const m = S.moves[+b.dataset.mv]; if (m && !m.why) m.act(); });
  // tapping a card only enlarges it
  el.querySelectorAll('.slot .tcard').forEach(t => t.onclick = () => {
    const slot = t.closest('.slot'), uid = slot.dataset.uid ? +slot.dataset.uid : null;
    let extra = '';
    if (uid != null && view) { const m = findM(view, uid); if (m) extra = `<b>In this game:</b> ❤ ${m.card.hp - m.dmg} of ${m.card.hp} HP left · ● ${m.nut} nutrient${m.nut === 1 ? '' : 's'}${view.isHome && view.place && view.isHome(m) ? ' · lives at this Place (fed +2)' : ''}`; }
    window.openBigCard(slot.dataset.cid, extra);
  });
}
function findM(view, uid) { for (const p of view.players) for (const m of [p.active, ...p.bench, ...p.hand]) if (m && m.uid === uid) return m; return null; }

// ---------- draft ----------
function draftStep() {
  if (S.pick >= S.order.length || !S.pool.length) return startSetup();
  const p = S.order[S.pick], human = S.human[p];
  S.moves = [];
  const pool = S.pool.map(c => slotHTML(c, {moves: human ? [{label: '✋ Pick', primary: true, act: () => ask(`${who(p)}: pick ${c.name}?`,
    [`${MC.LIFESTYLES[c.lifestyle].icon} ${MC.LIFESTYLES[c.lifestyle].name}, HP ${c.hp}, ${c.habitat === 'marine' ? 'sea' : 'lake'} microbe.`, `Picks left after this: ${S.order.length - S.pick - 1}.`],
    () => take(p, c), 'Pick it')}] : []})).join('');
  const team = t => t.map(c => slotHTML(c, {small: true})).join('') || '<span class="note">none yet</span>';
  root().innerHTML = `<div class="panel"><h2>Draft: ${human ? `${who(p)}, pick a microbe` : 'the computer is picking…'}</h2>
    <p class="note">Picking order: A, B, B, A, A, B, B, A, A, B. Tip: Happy Hunters (🎯) beat Gram-negative microbes, but Gram-positive ones and archaea can't be hunted. Tap a card to read it.</p>
    ${S.msg ? `<div class="prompt">${esc(S.msg)}</div>` : ''}
    <div class="row">${pool}</div></div>
    <div class="panel"><h3>${who(0)}</h3><div class="row">${team(S.teams[0])}</div><h3>${who(1)}</h3><div class="row">${team(S.teams[1])}</div></div>`;
  wireCommon(null);
  if (!human) setTimeout(() => { const c = MG.AI.draft(S.pool, S.teams[p], S.teams[1 - p], S.r); S.msg = `The computer picked ${c.name}.`; take(p, c, true); }, 1100);
}
function take(p, c, keepMsg) {
  if (!c || S.order[S.pick] !== p || !S.pool.includes(c)) return;
  S.teams[p].push(c); S.pool = S.pool.filter(x => x !== c); S.pick++;
  if (!keepMsg) S.msg = '';
  draftStep();
}

// ---------- setup ----------
function startSetup() {
  S.phase = 'setup'; S.msg = '';
  const first = S.r() < 0.5 ? 0 : 1;
  g = new MG.Game(DECK, S.teams.map(t => t.map(c => c.id)), {seed: S.seed, first, names: S.names});
  g.human = S.human;
  S.setupFor = 0;
  setupStep();
}
function setupStep() {
  const p = S.setupFor;
  if (p > 1) { S.phase = 'game'; S.msg = `Coin flip: ${who(g.cur)} ${S.mode === 'cpu' && g.cur === 0 ? 'go' : 'goes'} first, but can't attack on the very first turn.`; return beginTurn(); }
  if (!S.human[p]) { MG.AI.setup(g, p); S.setupFor++; return setupStep(); }
  cover(S.mode === 'hot' ? `${who(p)}: set up your microbes` : null, () => {
    const pl = g.players[p], place = g.place;
    S.moves = [];
    const hand = pl.hand.map(m => slotHTML(m.card, {moves: [{label: '⭐ Make Active', primary: true, act: () => {
      const rest = pl.hand.filter(x => x !== m), bench = rest.slice(0, g.rules.benchMax), keep = rest.slice(g.rules.benchMax);
      ask(`${m.card.name} as your Active?`, [`Bench: ${bench.map(x => x.card.name).join(', ') || 'nobody'}.`, keep.length ? `Kept in your hand: ${keep.map(x => x.card.name).join(', ')}.` : '',
        m.card.habitat !== place.water && !(place.water === 'marine' && m.card.badges.includes('salt')) ? `Careful: ${place.name} is ${place.water === 'marine' ? 'salt' : 'fresh'} water, so it will lose 10 HP at the start of each of your turns.` : ''],
        () => { g.setup(p, m.uid, bench.map(x => x.uid)); S.setupFor++; setupStep(); }, 'Start with it');
    }}]})).join('');
    root().innerHTML = `<div class="panel"><h2>${who(p)}: choose your Active microbe</h2>
      <p>The first Place is <b>${esc(place.name)}</b> (${place.water === 'marine' ? 'salt water' : 'fresh water'}, ${esc(place.season)}). Microbes from the wrong kind of water lose 10 HP at the start of each of your turns while Active. The next 3 go on your Bench.</p>
      <div class="row">${slotHTML(place, {small: true})}</div><div class="row">${hand}</div></div>`;
    wireCommon(g);
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
  S.ask = null; S.target = null; S.choice = null; drawBar();
  if (g.winner != null) return render();
  if (!S.human[g.cur]) return cpuTurn();
  cover(S.mode === 'hot' ? `${who(g.cur)}'s turn` : null, () => { S.started = false; S.drawn = null; preTurn(); });
}
// forced choices first (next Place, new Active), then the turn starts with the draw
function preTurn() {
  const p = g.cur, pl = g.players[p];
  if (g.pendingPlace === p && g.placeChoices(2).length) { S.choice = {type: 'place', choices: g.placeChoices(2)}; S.msg = 'One of your microbes was washed out, so you choose the next Place.'; return render(); }
  if (g.pendingPlace === p) g.pendingPlace = null;
  if (!pl.active && (pl.bench.length || pl.hand.length)) { S.choice = {type: 'promote'}; S.msg = 'Your Active was washed out. Choose a new Active.'; return render(); }
  if (g.pendingPromote === p) g.pendingPromote = null;
  S.choice = null;
  if (!S.started) {
    S.started = true;
    const before = pl.events.slice(), logAt = g.log.length;
    g.startTurn();
    const drawn = pl.events.find((id, i) => before[i] !== id) || (pl.events.length > before.length ? pl.events[pl.events.length - 1] : null);
    S.drawn = drawn != null ? pl.events.lastIndexOf(drawn) : null;
    const hurt = g.log.slice(logAt).filter(l => !/draws an Event/.test(l));
    S.msg = (drawn ? `Start of turn: you drew “${g.ev[drawn].name}” (marked NEW). ` : 'Start of turn: the Event pile is empty. ') + hurt.join(' ');
    if (g.winner != null) return render();
    if (!pl.active || g.pendingPlace === p) return preTurn();
  }
  render();
}
function after(msg) {  // after a confirmed move: the computer makes its forced choices; check for our own
  MG.AI.resolvePending(g);
  S.target = null; S.drawn = null; S.msg = msg || '';
  if (g.winner != null) return render();
  const p = g.cur, pl = g.players[p];
  if (!pl.active && (pl.bench.length || pl.hand.length)) { S.choice = {type: 'promote'}; S.msg = 'Your Active was washed out. Choose a new Active.'; }
  else if (g.pendingPlace === p && g.placeChoices(2).length) { S.choice = {type: 'place', choices: g.placeChoices(2)}; S.msg = 'Choose the next Place.'; }
  render();
}
function endTurn() { S.target = null; S.choice = null; S.msg = ''; S.drawn = null; g.endTurn(); beginTurn(); }

// the computer plays its whole turn on the real game; we record a copy after each step and replay them
function cpuTurn() {
  const frames = [];
  g.onLog = m => frames.push({msg: m, snap: g.clone()});
  const logAt = g.log.length;
  MG.AI.turn(g);
  g.onLog = null;
  frames.forEach((f, i) => { f.view = i + 1 < frames.length ? frames[i + 1].snap : g; });
  S.replay = {frames, i: 0, logAt};
  render();
  if (S.auto) autoStep();
}
function autoStep() { clearTimeout(S.timer); S.timer = setTimeout(() => { if (S && S.replay && S.auto) { nextFrame(); if (S.replay) autoStep(); } }, 1600); }
function nextFrame() {
  if (!S.replay) return;
  S.replay.i++;
  if (S.replay.i >= S.replay.frames.length) { S.replay = null; S.msg = ''; return beginTurn(); }
  render();
}

// ---------- the board ----------
function render() {
  if (!g || S.phase !== 'game') return;
  const rp = S.replay, frame = rp ? rp.frames[rp.i] : null;
  const V = frame ? frame.view : g;                 // the state shown
  const me = g.cur, viewer = S.mode === 'cpu' ? 0 : me;
  const live = !rp && S.human[me] && g.winner == null;  // can the player act now?
  S.moves = [];
  const pv = V.players[viewer], po = V.players[1 - viewer];
  const side = (pl, mine) => {
    const isTurn = V.cur === pl.p;
    const act = live && mine;
    const activeHTML = pl.active ? slotHTML(pl.active.card, {inst: pl.active, moves: act ? movesFor(pl.active, 'active') : targetMoves(pl.active)}) : '<div class="slot"><div class="emptyslot">no Active</div></div>';
    const bench = pl.bench.map(m => slotHTML(m.card, {inst: m, small: true, moves: act ? movesFor(m, 'bench') : targetMoves(m)})).join('');
    const hand = mine && pl.hand.length ? `<div><div class="note">In hand:</div><div class="row">${pl.hand.map(m => slotHTML(m.card, {inst: m, small: true, moves: act ? movesFor(m, 'hand') : []})).join('')}</div></div>` : '';
    const evs = mine ? `<div class="note" style="margin-top:6px">Your Event cards (one per turn):</div><div class="row">${pl.events.map((id, i) =>
      slotHTML(g.ev[id], {small: true, badge: act && S.drawn === i ? 'NEW' : '', moves: act ? eventMoves(id, i) : []})).join('') || '<span class="note">none</span>'}</div>` : '';
    return `<div class="side-area${isTurn ? ' me' : ''}"><h3>${esc(who(pl.p))}${isTurn ? ' ◀ turn' : ''} <span class="score">washed out ${pl.score}/${g.rules.winScore}</span>
      <span class="note">${pl.hand.length} microbe${pl.hand.length === 1 ? '' : 's'} in hand · ${pl.events.length} event${pl.events.length === 1 ? '' : 's'}</span></h3>
      <div class="row">${activeHTML}${bench}${hand}</div>${evs}</div>`;
  };
  const shown = rp ? g.log.slice(0, rp.logAt + rp.i + 1) : g.log;
  const placeMoves = [];
  let choiceHTML = '';
  if (live && S.choice?.type === 'place') choiceHTML = `<div class="row">${S.choice.choices.map(pc => slotHTML(pc, {small: true, moves: [{label: '🧭 Choose this Place', primary: true, act: () =>
    ask(`Move the game to ${pc.name} (${pc.season})?`, [`${pc.water === 'marine' ? 'Salt' : 'Fresh'} water. ${pc.text}`, `Lives here: ${pc.homes.map(h => h.name).join(', ')}.`], () => { g.setPlace(pc.id); S.choice = null; S.started ? after() : preTurn(); }, 'Choose it')}]})).join('')}</div>`;
  if (live && S.target?.type === 'trip') choiceHTML = `<div class="row">${S.target.choices.map(pc => slotHTML(pc, {small: true, moves: [{label: '🧭 Go here', primary: true, act: () =>
    ask(`Field Trip to ${pc.name} (${pc.season})?`, [`${pc.water === 'marine' ? 'Salt' : 'Fresh'} water. ${pc.text}`, 'Uses your Event for this turn.'], () => { g.playEvent('trip', pc.id); after(); }, 'Play it')}]})).join('')}</div>`;
  root().innerHTML = `<div class="board">
    ${statusBar(live, frame)}
    ${choiceHTML}
    ${side(po, false)}
    <div class="mid"><div><div class="note">Place now:</div><div class="row">${slotHTML(V.place, {small: true, moves: placeMoves})}</div>
      <div class="note">${V.placeDeck.length} more places · ${V.eventDeck.length} events in the pile</div></div>
      <div class="log" id="gameLog">${shown.slice(-60).map((l, i, a) => `<div${rp && i === a.length - 1 ? ' class="hl"' : ''}>${esc(l)}</div>`).join('')}</div></div>
    ${side(pv, true)}
    <p class="note"><button class="btn" id="quitBtn">Quit game</button></p>
  </div>`;
  const lg = document.getElementById('gameLog'); if (lg) lg.scrollTop = lg.scrollHeight;
  wireCommon(V);
  const q = document.getElementById('quitBtn'); if (q) q.onclick = () => ask('Quit this game?', ['The game ends and cannot be resumed.'], menu, 'Quit');
  const nx = document.getElementById('nextBtn'); if (nx) nx.onclick = nextFrame;
  const sk = document.getElementById('skipBtn'); if (sk) sk.onclick = () => { S.replay.i = S.replay.frames.length - 1; nextFrame(); };
  const au = document.getElementById('autoBox'); if (au) au.onchange = () => { S.auto = au.checked; if (S.auto) autoStep(); else clearTimeout(S.timer); };
  const en = document.getElementById('endBtn'); if (en) en.onclick = askEndTurn;
  const ag = document.getElementById('againBtn'); if (ag) ag.onclick = menu;
  const cn = document.getElementById('cancelBtn'); if (cn) cn.onclick = () => { S.target = null; S.msg = ''; render(); };
  drawBar();
}
function statusBar(live, frame) {
  if (g.winner != null && !S.replay) return `<div class="status win">🏆 ${esc(who(g.winner))} ${S.mode === 'cpu' && g.winner === 0 ? 'win' : 'wins'}! <button class="btn primary" id="againBtn">Play again</button></div>`;
  if (frame) return `<div class="status cpu"><span>🤖 <b>Computer, step ${S.replay.i + 1} of ${S.replay.frames.length}:</b> ${esc(frame.msg)}</span>
    <span class="sb"><button class="btn primary" id="nextBtn">Next ▶</button><button class="btn" id="skipBtn">Skip to my turn</button>
    <label class="note"><input type="checkbox" id="autoBox"${S.auto ? ' checked' : ''}> auto</label></span></div>`;
  if (!live) return '';
  const t = g.t || {};
  const todo = [!t.fed && 'feed a microbe', !t.event && g.players[g.cur].events.length && 'play an Event', !t.attacked && g.turn > 1 && 'attack'].filter(Boolean);
  const head = S.choice ? '' : S.target ? `<button class="btn" id="cancelBtn">Cancel</button>` : `<button class="btn" id="endBtn">End turn ⏭</button>`;
  return `<div class="status"><span><b>${esc(who(g.cur))}, your turn.</b> ${esc(S.msg || '')}${!S.choice && !S.target && todo.length ? ` <span class="note">You can still: ${todo.join(', ')}.</span>` : ''}</span><span class="sb">${head}</span></div>`;
}

// ---------- moves under each card ----------
function movesFor(m, where) {
  if (S.choice?.type === 'promote') return where !== 'active' ? [{label: '⭐ Make Active', primary: true, act: () =>
    ask(`${m.card.name} becomes your Active?`, [where === 'hand' ? 'It comes from your hand.' : 'It comes from your Bench.', outOfPlaceNote(m)], () => { g.promote(g.cur, m.uid); S.choice = null; S.started ? after() : preTurn(); }, 'Make Active')}] : [];
  if (S.target) return targetMoves(m);
  const pl = g.players[g.cur], t = g.t, out = [];
  if (where === 'active') {
    g.attacksFor(m).forEach((ch, i) => {
      const a = ch.a, opp = g.rival(g.cur).active;
      const why = g.turn === 1 ? 'no attack on the first turn' : t.attacked ? 'already attacked' : !opp ? 'no rival Active' : m.nut < a.cost ? `needs ${a.cost} ●, has ${m.nut}` : '';
      const d = opp && a.effect?.type !== 'snipe' ? ` · ${g.calcDamage(m, a, opp)} dmg` : a.effect?.type === 'snipe' ? ' · pick target' : '';
      out.push({label: `⚔ ${a.name}${ch.borrowed ? ' (swapped gene)' : ''} ${'●'.repeat(a.cost)}${d}`, why, primary: !why, act: () => {
        if (a.effect?.type === 'snipe') { S.target = {type: 'snipe', idx: i}; S.msg = `${a.name}: choose which rival microbe to hit (buttons under their cards).`; return render(); }
        askAttack(i, null);
      }});
    });
  }
  if (where !== 'hand') {
    const n = g.isHome(m) ? 2 : 1;
    out.push({label: `🍽️ Feed +${n}`, why: t.fed ? 'already fed this turn' : '', act: () =>
      ask(`Feed ${m.card.name}?`, preview(c => c.feed(m.uid)).concat(['You can feed once per turn.']), () => { g.feed(m.uid); after(); }, 'Feed')});
  }
  if (where === 'bench') {
    const a = pl.active, cost = a ? a.card.retreat : 0;
    const why = !a ? 'no Active' : t.retreated ? 'already retreated this turn' : a.nut < cost ? `${a.card.name} needs ${cost} ● to retreat` : '';
    out.push({label: `↩ Swap in (retreat, pay ${cost} ●)`, why, act: () =>
      ask(`Retreat ${a.card.name} and bring in ${m.card.name}?`, [`${a.card.name} pays ${cost} nutrient${cost === 1 ? '' : 's'} and goes to the Bench with its damage.`, outOfPlaceNote(m)], () => { g.retreat(m.uid); after(); }, 'Retreat')});
  }
  if (where === 'hand') {
    out.push({label: '➕ Put on Bench', why: pl.bench.length >= g.rules.benchMax ? 'Bench is full (3)' : '', act: () =>
      ask(`Put ${m.card.name} on your Bench?`, ['It stays there until it is needed. It can be fed while on the Bench.'], () => { g.benchFromHand(m.uid); after(); }, 'Put on Bench')});
  }
  return out;
}
function outOfPlaceNote(m) { return g.outOfPlace(m) ? `Careful: it is in the wrong water here and will lose 10 HP at the start of your turns while Active.` : ''; }
// target buttons while choosing who a snipe, an event or a free switch should affect
function targetMoves(m) {
  const T = S.target; if (!T || S.replay || !S.human[g.cur]) return [];
  const me = g.cur, pl = g.players[me];
  if (T.type === 'snipe' && m.owner !== me) {
    const a = g.attacksFor(pl.active)[T.idx].a, dp = g.damageParts(pl.active, a, m);
    return [{label: `🎯 Hit this · ${dp.d} dmg`, primary: true, act: () => askAttack(T.idx, m.uid)}];
  }
  if (T.type === 'event' && T.targets.some(t => t.uid === m.uid)) {
    const e = g.ev[T.id];
    return [{label: `${e.icon} ${e.name} here`, primary: true, act: () =>
      ask(`Play ${e.name} on ${m.card.name}?`, preview(c => c.playEvent(T.id, m.uid)).concat(['Uses your Event for this turn.']), () => { g.playEvent(T.id, m.uid); after(); }, 'Play it')}];
  }
  if (T.type === 'switch' && m.owner === me && pl.bench.includes(m)) return [{label: '↩ Switch in (free)', primary: true, act: () =>
    ask(`Switch ${pl.active.card.name} with ${m.card.name}?`, ['Free, from Glide Away / Dash Away.', outOfPlaceNote(m)], () => { g.retreat(m.uid, true); S.target = null; after('Your attack is done. End your turn when ready.'); }, 'Switch')}];
  return [];
}
function askAttack(i, targetUid) {
  const pl = g.players[g.cur], me = pl.active, ch = g.attacksFor(me)[i], a = ch.a;
  const tgt = targetUid != null ? findM(g, targetUid) : g.rival(g.cur).active;
  const dp = g.damageParts(me, a, tgt);
  const lines = [`${dp.parts.join(', ')} → ${dp.d} damage (${tgt.card.name} has ${tgt.card.hp - tgt.dmg} HP left).`];
  if (me.card.ability?.key === 'mystery') lines.push('Mystery Genes: a coin is flipped; heads adds 20.');
  lines.push(...preview(c => c.attack(i, targetUid)).filter(l => !/ uses /.test(l)));
  if (a.effect?.type === 'freeSwitch') lines.push('Afterwards you may switch it with a Bench microbe for free.');
  lines.push('Attacking ends your turn.');
  ask(`${a.name}: ${dp.d} damage to ${tgt.card.name}`, lines, () => {
    S.target = null;
    if (!g.attack(i, targetUid)) { S.msg = 'That attack could not be used.'; return render(); }
    MG.AI.resolvePending(g);
    if (g.winner == null && a.effect?.type === 'freeSwitch' && pl.active === me && pl.bench.length) {
      S.target = {type: 'switch'}; S.msg = 'You may switch your Active with a Bench microbe for free (buttons under your Bench), or end your turn.'; return render();
    }
    after('Your attack is done. End your turn when ready.');
  }, 'Attack');
}
function eventMoves(id, i) {
  const e = g.ev[id], t = g.t;
  if (S.choice || S.target) return [];
  if (t.event) return [{label: '▶ Play', why: 'one Event per turn', act: () => {}}];
  if (t.attacked) return [{label: '▶ Play', why: 'turn is over after attacking', act: () => {}}];
  const needs = {bloom: 'own', stirup: 'own', b12: 'own', seedbank: 'own', tide: 'rival'};
  return [{label: '▶ Play', primary: true, act: () => {
    if (id === 'trip') { const ch = g.placeChoices(3); if (!ch.length) { S.msg = 'No Place cards left to visit.'; return render(); }
      S.target = {type: 'trip', choices: ch}; S.msg = 'Field Trip: choose the next Place (buttons under the Places at the top).'; return render(); }
    if (needs[id]) {
      let targets = g.eventTargets(id) || [];
      if (id === 'b12') targets = targets.filter(m => m.dmg > 0);
      if (id === 'seedbank' && g.inPlay(g.players[g.cur]).length < 2) targets = [];
      if (!targets.length) { S.msg = `${e.name} has nothing to work on right now.`; return render(); }
      S.target = {type: 'event', id, targets}; S.msg = `${e.name}: choose a microbe (buttons under the cards). ${e.text}`; return render();
    }
    const lines = preview(c => c.playEvent(id, null));
    if (!lines.length) { S.msg = `${e.name} would do nothing right now.`; return render(); }
    ask(`Play ${e.name}?`, lines.concat(['Uses your Event for this turn.']), () => { g.playEvent(id, null); after(); }, 'Play it');
  }}];
}
function askEndTurn() {
  const t = g.t, pl = g.players[g.cur];
  const unused = [!t.fed && 'you have not fed a microbe', !t.attacked && g.turn > 1 && pl.active && 'you have not attacked', !t.event && pl.events.length && 'you have not played an Event'].filter(Boolean);
  ask('End your turn?', [unused.length ? `Note: ${unused.join('; ')}.` : '', ...preview(c => c.endTurn())], endTurn, 'End turn');
}

window.MicrobePlay = {open, debug: () => ({g, S})};  // debug: read-only access for tests
})();
