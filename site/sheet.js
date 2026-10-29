// Printable two-sided Letter sheet per microbe (index.html#N/sheet, or #all/sheet for every microbe).
// Front: meet the microbe. Back: want to know more, and a worksheet to help name it.
// Shared by every community; uses the page's own helpers (lineageOf, namingNeed, whereFound,
// suggestWords, GUILDS, img) and data, so it always matches the site.
(function () {
'use strict';
const SEASON = m => m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'fall' : 'winter';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// where and when it was found locally: site -> months, most abundant site first
function foundRows(c) {
  const rows = (D.northMap[c.id]?.ci_samples || []).filter(r => r.detected), by = {};
  rows.forEach(r => { const s = by[r.site] = by[r.site] || {best: -1, months: new Set()};
    s.best = Math.max(s.best, r.relab ?? 0);
    if (/^\d{8}$/.test(r.date || '')) s.months.add(+r.date.slice(4, 6)); });
  return Object.entries(by).sort((a, b) => b[1].best - a[1].best)
    .map(([site, s]) => `${esc(site)}${s.months.size ? ` (${[...s.months].sort((a, b) => a - b).map(m => MONTHS[m - 1]).join(', ')})` : ''}`);
}

function sheetFor(i) {
  const c = C[i], need = namingNeed(c), L = lineageOf(c), g = GUILDS[c.guild], m = D.meta[c.id] || {};
  const where = foundRows(c), gen = !need.genus && (window.GENERA || {})[need.genusName];
  const words = (typeof suggestWords === 'function' && DICT_SHOWN.length ? suggestWords(c) : []).slice(0, 8);
  const site = `${location.origin}${location.pathname}#${i + 1}`;
  const head = `<div class="sh-head"><span>${esc(CM.brand || CM.placeName || '')} · ${esc(CM.nativeName || '')}</span><span>Microbe ${i + 1} of ${C.length}</span></div>`;
  const tree = L.map(x => `<tr><th>${x.rank}</th><td>${x.ph ? '<span class="sh-new">no name yet</span>' : `<i>${esc(x.name.replace(/_[A-Z]+\b/g, ''))}</i>`}</td></tr>`).join('');
  const line = (label, n = 1) => `<div class="sh-fill"><b>${label}</b>${'<span></span>'.repeat(n)}</div>`;
  return `
  <section class="sh-page sh-front ${c.habitat}">
    ${head}
    <h1>${esc(c.nickname)}</h1>
    <div class="sh-pills">
      <span>${c.habitat === 'marine' ? '🌊 Sea microbe' : '💧 Lake microbe'}</span>
      ${c.isolated ? '<span>🧫 Grown in the lab</span>' : ''}
      ${g ? `<span>${g.icon} ${esc(g.name)}</span>` : ''}
      <span>✍️ ${esc(need.label)}</span>
    </div>
    <div class="sh-top">
      <img src="${img(i)}" alt="">
      <div>
        <h3>🧬 Family tree</h3>
        <table class="sh-tree">${tree}</table>
      </div>
    </div>
    ${c.cardFact ? `<p class="sh-fact">⭐ ${esc(c.cardFact)}</p>` : ''}
    <h3>📖 Its story</h3>
    <p class="sh-story">${esc(c.eco || c.story || '')}</p>
    <div class="sh-cols">
      ${g ? `<div><h3>${g.icon} How it makes a living</h3><p>${esc(g.text)}</p></div>` : ''}
      <div><h3>📍 Where we found it</h3><p>${[...where, ...(c.isolated ? [`grown in the lab from ${esc(c.isolated.site)} water (${esc(c.isolated.season || '')})`] : [])].join('; ') || 'Not yet found in our water samples.'}</p>
        <p class="sh-note">Genome: ${fmt((m.size || 0) / 1e6, 1)} million DNA letters, ${fmt(m.completeness)}% complete.</p></div>
    </div>
  </section>
  <section class="sh-page sh-back">
    ${head}
    <h2>${esc(c.nickname)}: help name it</h2>
    ${(c.ecoMore || []).length ? `<h3>🔍 Want to know more?</h3><dl class="sh-qa">${c.ecoMore.map(([q, a]) => `<dt>${esc(q)}</dt><dd>${esc(a)}</dd>`).join('')}</dl>` : ''}
    <h3>✍️ What are we naming?</h3>
    <p>${need.genus
      ? `It needs a <b>new genus and species</b>: two new words. The genus (first word) starts with a capital letter; the species (second word) is all lowercase.`
      : `It belongs to the genus <i>${esc(need.genusName)}</i>${gen ? `, which means “${esc(gen.gloss)}”` : ''}. That name stays. It needs a new <b>species</b> name: the second word, all lowercase.`}
      A good name often says where it lives, what it does or what it looks like.</p>
    ${words.length ? `<h3>💡 ${esc(LANG)} words that might fit</h3>
      <div class="sh-words">${words.map(h => `<div title="${esc([...h.why].join(' · '))}"><b>${esc(h.e.roman)}</b>${h.e.syllabics ? ` ${esc(h.e.syllabics)}` : ''}<span>${esc(h.e.english)}</span></div>`).join('')}</div>` : ''}
    <div class="sh-work">
      ${need.genus ? `${line(`Genus word (${esc(LANG)})`)}${line('It means')}` : `<div class="sh-fill"><b>Genus</b><span class="sh-fixed"><i>${esc(need.genusName)}</i></span></div>`}
      ${line(`Species word (${esc(LANG)})`)}${line('It means')}
      ${line('Our name', 1)}
      ${line('Why we chose it', 2)}
    </div>
    <p class="sh-note sh-url">More about this microbe, and a tool to build the Latin name: ${esc(site)}</p>
  </section>`;
}

function showSheets(list) {
  document.body.classList.add('sheetmode');
  let box = document.getElementById('sheets');
  if (!box) { box = document.createElement('div'); box.id = 'sheets'; document.body.appendChild(box); }
  const one = list.length === 1;
  box.innerHTML = `<div class="sh-bar noprint">
      <button class="btn primary" onclick="window.print()">🖨️ Print</button>
      ${one ? `<a class="btn" href="#${list[0] + 1}">◀ Back to ${esc(C[list[0]].nickname)}</a>` : `<a class="btn" href="#">◀ Back</a>`}
      <span class="note">Letter paper, double-sided (flip on long edge). Keep the printer's normal margins.${one ? ` <a href="#all/sheet">Print all ${C.length} microbes</a>` : ''}</span>
    </div>` + list.map(sheetFor).join('');
  let ps = document.getElementById('sheetPage');
  if (!ps) { ps = document.createElement('style'); ps.id = 'sheetPage'; document.head.appendChild(ps); }
  ps.textContent = '@page{size:letter portrait}';  // the printer sets the margins
  document.title = one ? `${C[list[0]].nickname}: printable sheet` : 'Printable microbe sheets';
  window.scrollTo(0, 0);
}
function route() {
  const h = location.hash.match(/^#(\d+|all)\/sheet$/);
  if (h) return showSheets(h[1] === 'all' ? C.map((c, i) => i) : [+h[1] - 1]);
  if (document.body.classList.contains('sheetmode')) location.reload();  // leaving the sheet: back to the normal page
}
window.addEventListener('hashchange', route);
route();
})();
