// cards.html: deck view, big card view, rules and print sheets. Shared by every community.
(function () {
'use strict';
const MC = window.MicrobeCards, R = window.MicrobeRender, RU = window.MicrobeRules, CM = window.COMMUNITY || {};
const DECK = MC.buildDeck({candidates: window.CANDIDATES || [], narratives: window.NARRATIVES || {}, data: window.EXTRA_SITE_DATA || {}, community: CM});
const ALL = [...DECK.microbes, ...DECK.places, ...DECK.events], TOTAL = ALL.length;
window.CARD_DECK = DECK;
const $ = id => document.getElementById(id);
const brand = CM.brand || 'Microbes';
document.title = `${RU.GAME_NAME} · ${brand}`;
$('brandName').textContent = brand;
$('gameName').textContent = RU.GAME_NAME;
$('homeLink').href = 'index.html';

// ---------- views ----------
const VIEWS = ['deck', 'rules', 'print', 'play'];
function show(v) {
  if (!VIEWS.includes(v)) v = 'deck';
  VIEWS.forEach(x => { $('view-' + x).classList.toggle('hidden', x !== v); $('nav-' + x).classList.toggle('on', x === v); });
  if (v === 'play' && window.MicrobePlay) window.MicrobePlay.open(DECK);
  if (location.hash !== '#' + v) history.replaceState(null, '', '#' + v);
}
VIEWS.forEach(v => $('nav-' + v).addEventListener('click', () => show(v)));
window.addEventListener('hashchange', () => show(location.hash.slice(1)));

// ---------- deck ----------
let filt = 'all';
const FILTERS = [['all', 'All cards'], ['microbe', 'Microbes'], ['place', 'Places'], ['event', 'Events'],
  ...Object.entries(MC.LIFESTYLES).filter(([k]) => DECK.microbes.some(c => c.lifestyle === k)).map(([k, L]) => [k, `${L.icon} ${L.plural || L.name}`])];
function renderDeck() {
  $('chips').innerHTML = FILTERS.map(([k, n]) => `<button class="chip${k === filt ? ' on' : ''}" data-f="${k}">${n}</button>`).join('');
  const list = ALL.filter(c => filt === 'all' || c.type === filt || c.lifestyle === filt);
  $('deck').innerHTML = list.map(c => R.face(c, TOTAL)).join('');
  const waiting = (window.CANDIDATES || []).filter(c => !DECK.microbes.some(m => m.id === c.id)).map(c => c.nickname || c.id);
  $('deckCount').textContent = `${DECK.microbes.length} microbes, ${DECK.places.length} places and ${DECK.events.length} events: ${TOTAL} cards, ${Math.ceil(TOTAL / 9)} printed pages.`
    + (waiting.length ? ` Waiting for data before they get a card: ${waiting.join(', ')}.` : '');
}
$('chips').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) { filt = b.dataset.f; renderDeck(); } });
$('deck').addEventListener('click', e => { const t = e.target.closest('.tcard'); if (t) openBig(t.dataset.id); });

// ---------- big view ----------
let bigIdx = -1;
// extra: optional HTML shown above the explanation (e.g. damage and nutrients during a game)
function openBig(id, extra) {
  bigIdx = ALL.findIndex(c => c.id === id); if (bigIdx < 0) return;
  const c = ALL[bigIdx];
  $('bigCard').innerHTML = R.face(c, TOTAL);
  $('bigSide').innerHTML = (extra ? `<div class="inplay">${extra}</div>` : '') + R.details(c);
  $('big').classList.add('on'); $('big').scrollTop = 0;
}
function closeBig() { $('big').classList.remove('on'); }
window.openBigCard = openBig;
$('big').addEventListener('click', e => { if (e.target.id === 'big' || e.target.closest('.x')) closeBig(); });
$('bigPrev').addEventListener('click', () => openBig(ALL[(bigIdx - 1 + TOTAL) % TOTAL].id));
$('bigNext').addEventListener('click', () => openBig(ALL[(bigIdx + 1) % TOTAL].id));
document.addEventListener('keydown', e => {
  if (!$('big').classList.contains('on')) return;
  if (e.key === 'Escape') closeBig();
  if (e.key === 'ArrowLeft') $('bigPrev').click();
  if (e.key === 'ArrowRight') $('bigNext').click();
});

// ---------- rules ----------
$('rulesQuick').innerHTML = RU.QUICK;
$('rulesFull').innerHTML = RU.FULL;

// ---------- print ----------
const PAPER = {a4: [210, 297], letter: [215.9, 279.4]};
const CW = 63, CH = 88;
function sheetFor(cards, [W, H], mirror) {
  const ox = (W - 3 * CW) / 2, oy = (H - 3 * CH) / 2;
  const cells = Array(9).fill('<div></div>');
  cards.forEach((html, i) => { const r = Math.floor(i / 3), c = i % 3; cells[r * 3 + (mirror ? 2 - c : c)] = html; });
  let marks = '';
  const L = 5, gap = 1, w = 0.2;
  [0, 1, 2, 3].forEach(i => {
    const x = ox + i * CW, y = oy + i * CH;
    marks += `<div class="cut" style="left:${x - w / 2}mm;top:${oy - gap - L}mm;width:${w}mm;height:${L}mm"></div>`;
    marks += `<div class="cut" style="left:${x - w / 2}mm;top:${oy + 3 * CH + gap}mm;width:${w}mm;height:${L}mm"></div>`;
    marks += `<div class="cut" style="top:${y - w / 2}mm;left:${ox - gap - L}mm;height:${w}mm;width:${L}mm"></div>`;
    marks += `<div class="cut" style="top:${y - w / 2}mm;left:${ox + 3 * CW + gap}mm;height:${w}mm;width:${L}mm"></div>`;
  });
  return `<div class="sheet" style="width:${W}mm;height:${H}mm">${marks}<div class="grid" style="left:${ox}mm;top:${oy}mm">${cells.join('')}</div></div>`;
}
function buildSheets() {
  const paper = PAPER[$('pPaper').value] || PAPER.a4;
  const want = {microbe: $('pMicrobes').checked, place: $('pPlaces').checked, event: $('pEvents').checked};
  const cards = ALL.filter(c => want[c.type]);
  const backs = $('pBacks').checked;
  let html = '';
  if ($('pRules').checked) {
    const [W, H] = paper, m = 12;
    html += `<div class="sheet rulesheet" style="width:${W}mm;height:${H}mm"><div class="rbox" style="left:${m}mm;top:${m}mm;width:${W - 2 * m}mm;height:${H - 2 * m}mm">
      <h2>${R.esc(RU.GAME_NAME)}: quick rules</h2>${RU.QUICK}<p style="font-size:8.5pt;color:#3c5470">Every card's numbers come from real DNA data from the ${R.esc(CM.placeName || '')} samples. Full rules and the science behind each card: cards.html on the workshop site.</p></div></div>`;
  }
  for (let i = 0; i < cards.length; i += 9) {
    const page = cards.slice(i, i + 9);
    html += sheetFor(page.map(c => R.face(c, TOTAL)), paper, false);
    if (backs) html += sheetFor(page.map(c => R.back(c.type, brand, RU.GAME_NAME)), paper, true);
  }
  if ($('pTokens').checked) {
    const [W, H] = paper; let t = '';
    for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) {
      const kind = r < 7 ? 'n' : 'd', label = kind === 'n' ? '●' : (c % 5 === 4 ? '50' : '10');
      t += `<div class="tok ${kind}" style="left:${(W - 10 * 18) / 2 + c * 18}mm;top:${12 + r * 19}mm">${label}</div>`;
    }
    html += `<div class="sheet tokens" style="width:${W}mm;height:${H}mm"><div class="label" style="left:12mm;top:5mm">Nutrient tokens (green) and damage tokens (red): cut out, or use coins and beads instead.</div>${t}</div>`;
  }
  $('sheets').className = $('pInk').checked ? 'ink' : '';
  // print sheets are hidden on screen, so lazy images would never load before printing
  $('sheets').innerHTML = html.replace(/loading="lazy"/g, 'loading="eager"');
  $('pageStyle').textContent = `@page{size:${$('pPaper').value === 'letter' ? 'letter' : 'A4'} portrait;margin:0}`;
  const n = $('sheets').querySelectorAll('.sheet').length;
  $('printInfo').textContent = `${cards.length} cards → ${n} page${n === 1 ? '' : 's'}${backs ? ' (fronts and backs alternate: print double-sided, flip on long edge)' : ''}.`;
}
['pPaper', 'pMicrobes', 'pPlaces', 'pEvents', 'pBacks', 'pRules', 'pTokens', 'pInk'].forEach(id => $(id).addEventListener('change', buildSheets));
// wait for every picture on the sheets before opening the print dialog
const sheetsReady = () => Promise.all([...$('sheets').querySelectorAll('img')].map(i => i.complete ? null : new Promise(r => { i.addEventListener('load', r, {once: true}); i.addEventListener('error', r, {once: true}); })));
$('doPrint').addEventListener('click', async () => {
  const b = $('doPrint'), t = b.textContent; b.disabled = true; b.textContent = 'Loading pictures…';
  await sheetsReady(); b.disabled = false; b.textContent = t; window.print();
});
$('pPaper').value = /US|CA/.test(navigator.language || '') ? 'letter' : 'a4';

renderDeck(); buildSheets();
show(location.hash.slice(1) || 'deck');
})();
