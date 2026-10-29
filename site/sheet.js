// Printable two-sided Letter sheet per microbe (index.html#N/sheet, or #all/sheet for every microbe).
// Front: meet the microbe (family tree, genome, maps, story). Back: what it does for the ecosystem,
// and a worksheet to help name it. Shared by every community; uses the page's own helpers
// (lineageOf, namingNeed, suggestWords, GUILDS, img) and data, so it always matches the site.
(function () {
'use strict';
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

// its biggest local count, in cells per litre, worked out as on the Distribution tab
function peak(c) {
  const rows = (D.northMap[c.id]?.ci_samples || []).filter(r => r.detected && r.relab > 0);
  if (!rows.length) return '';
  const top = rows.reduce((a, b) => b.relab > a.relab ? b : a);
  const CMOD = D.cellModel || {cells_per_litre: {}, mean_genome_bp: 3e6};
  const perL = (CMOD.cells_per_litre || {})[c.habitat] || 1e9, size = (D.meta[c.id] || {}).size || CMOD.mean_genome_bp;
  const n = top.relab / 100 * perL * (CMOD.mean_genome_bp || 3e6) / size;
  const amt = n >= 1e6 ? `${fmt(n / 1e6, n < 1e7 ? 1 : 0)} million` : n >= 1e3 ? `${Math.round(n / 1e3).toLocaleString('en-CA')} thousand` : 'under a thousand';
  const when = /^\d{8}$/.test(top.date || '') ? `, ${MONTHS[+top.date.slice(4, 6) - 1]}` : '';
  return `<b>Most:</b> about ${amt} cells per litre (${esc(top.site)}${when}).`;
}

function sheetFor(i) {
  const c = C[i], need = namingNeed(c), L = lineageOf(c), g = GUILDS[c.guild], m = D.meta[c.id] || {};
  const where = [...foundRows(c), ...(c.isolated ? [`grown in the lab from ${esc(c.isolated.site)} water (${esc(c.isolated.season || '')})`] : [])];
  const gen = !need.genus && (window.GENERA || {})[need.genusName];
  const words = (typeof suggestWords === 'function' && DICT_SHOWN.length ? suggestWords(c) : []).slice(0, 8);
  const SI = window.SERVICE_INFO || {}, es = (D.ecossdb[c.id] || []).slice().sort((a, b) => b.weighted_score - a.weighted_score).slice(0, 4);
  const site = `${location.origin}${location.pathname}#${i + 1}`;
  const head = `<div class="sh-head"><span>${esc(CM.brand || CM.placeName || '')} · ${esc(CM.nativeName || '')}</span><span>Microbe ${i + 1} of ${C.length}</span></div>`;
  // ranks with no Latin name show the code name scientists use for now (e.g. TMED14, sp028352435)
  const tree = L.map(x => { const code = x.ph && !/^\(no name/.test(x.name) ? (x.rank === 'Species' ? x.name.split(' ').pop() : x.name) : '';
    return `<tr><th>${x.rank}</th><td>${x.ph ? `${code ? `<span class="sh-code">${esc(code)}</span> ` : ''}<span class="sh-new">no name yet</span>` : `<i>${esc(x.name.replace(/_[A-Z]+\b/g, ''))}</i>`}</td></tr>`; }).join('');
  const rr = (c.rrna || '').replace(/\d+\s*[×x]\s*/g, '');  // '9× 16S + 9× 23S' -> '16S + 23S'
  const asm = [
    ['Genome', `${fmt((m.size || 0) / 1e6, 2)} million DNA letters`],
    ['Complete', `${fmt(m.completeness)}% (contamination ${fmt(m.contamination, 2)}%)`],
    ['Pieces', `${m.n_contigs ?? '—'} contigs${m.n50 ? `, N50 ${fmt(m.n50 / 1e3, 0)} kbp` : ''}`],
    ['Genes', `${(m.n_genes || 0).toLocaleString('en-CA')}${m.hypo_pct != null ? `, ${fmt(m.hypo_pct, 0)}% unknown` : ''}`],
    ['GC', m.gc != null ? `${fmt(m.gc * 100, 1)}%` : '—'],
    ...(rr ? [['rRNA', esc(rr)]] : []),
  ].map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  const line = (label, n = 1) => `<div class="sh-fill"><b>${label}</b>${'<span></span>'.repeat(n)}</div>`;
  return `
  <section class="sh-page sh-front ${c.habitat}" id="sheet-${i + 1}">
    ${head}
    <div class="sh-title">
      <img src="${img(i)}" alt="">
      <div><h1>${esc(c.nickname)}</h1>
        <div class="sh-pills">
          <span>${c.habitat === 'marine' ? '🌊 Sea microbe' : '💧 Lake microbe'}</span>
          ${c.isolated ? '<span>🔬 Grown in the lab</span>' : ''}
          ${g ? `<span>${g.icon} ${esc(g.name)}</span>` : ''}
        </div>
        ${g ? `<p class="sh-guild">${g.icon} <b>${esc(g.name)}</b>: ${esc(g.short)}</p>` : ''}</div>
    </div>
    <div class="sh-top">
      <div><h3>🧬 Family tree</h3><table class="sh-tree">${tree}</table></div>
      <div><h3>🧩 Its genome</h3><table class="sh-tree sh-asm">${asm}</table>
        <p class="sh-note">ID <code>${esc(c.id)}</code></p></div>
    </div>
    <div class="sh-maps">
      <div><h3>📍 Around ${esc(LOCAL)}</h3><div class="sh-map" data-map="local" data-i="${i}"></div></div>
      <div><h3>🌍 The North</h3><div class="sh-map" data-map="north" data-i="${i}"></div></div>
    </div>
    <p class="sh-credit">Maps © OpenStreetMap contributors · Leaflet</p>
    <p class="sh-where"><b>📅 Found:</b> ${where.join('; ') || 'not yet in our water samples'}. ${peak(c)}</p>
    <p class="sh-note">Bigger dots: more of its cells per litre. Grey dots: sampled, but not found. Gold ring: ${esc(LOCAL)}.</p>
    <h3>📖 Its story</h3>
    <p class="sh-story">${esc(c.eco || c.story || '')}</p>
  </section>
  <section class="sh-page sh-back">
    ${head}
    <h2>${esc(c.nickname)}: help name it</h2>
    ${es.length ? `<h3>🌿 What it does for the ecosystem</h3>
      <div class="sh-es">${es.map(x => { const info = SI[x.code] || {};
        const pt = (c.esPoints || {})[x.code];  // narratives.js: this microbe's own point in the category
        return `<div><span class="sh-note">${x.icon} ${esc(info.title || x.short_name)}</span><b class="sh-es-h">${esc(pt ? pt[0] : info.title || x.short_name)}</b><p>${esc(pt ? pt[1] : info.front || x.desc)}</p><p class="sh-note">${x.gene_count} gene${x.gene_count === 1 ? '' : 's'} linked to this</p></div>`; }).join('')}</div>
      <p class="sh-note">Predicted from its genes (EcoSSDB).</p>` : ''}
    <h3>✍️ What are we naming?</h3>
    <p>${need.genus
      ? `It needs a <b>new genus and species</b>: two new words. The genus (first word) starts with a capital letter; the species (second word) is all lowercase.`
      : `It belongs to the genus <i>${esc(need.genusName)}</i>${gen ? `, which means “${esc(gen.gloss)}”` : ''}. It needs a new <b>species</b> name: the second word, all lowercase.`}
      A good name often says where it lives, what it does or what it looks like.</p>
    ${words.length ? `<h3>💡 ${esc(LANG)} words that might fit</h3>
      <div class="sh-words">${words.map(h => `<div title="${esc([...h.why].join(' · '))}"><b>${esc(h.e.roman)}</b>${h.e.syllabics ? ` ${esc(h.e.syllabics)}` : ''}<span>${esc(h.e.english)}</span></div>`).join('')}</div>` : ''}
    <div class="sh-lines"><div></div><div></div></div>
    <div class="sh-work">
      ${need.genus ? `${line(`Genus word (${esc(LANG)})`)}${line('It means')}` : `<div class="sh-fill"><b>Genus</b><span class="sh-fixed"><i>${esc(need.genusName)}</i></span></div>`}
      ${line(`Species word (${esc(LANG)})`)}${line('It means')}
      ${line('Our name', 1)}
      ${line('Why we chose it', 2)}
    </div>
    <p class="sh-note sh-url">More about this microbe, and a tool to build the Latin name: ${esc(site)}</p>
  </section>`;
}

// small static Leaflet maps: same extents as the Distribution tab, no interaction
let pending = 0;
function drawMaps(box, onReady) {
  const els = [...box.querySelectorAll('.sh-map')];
  if (!window.L) { els.forEach(e => { e.innerHTML = '<p class="sh-note">The maps need an internet connection.</p>'; }); return onReady(); }
  pending = els.length;
  const done = () => { if (--pending <= 0) onReady(); };
  els.forEach(el => {
    const c = C[+el.dataset.i], nm = D.northMap[c.id] || {};
    const map = L.map(el, {zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false,
      keyboard: false, touchZoom: false, attributionControl: false, zoomSnap: 0.25,  // credit is printed under the maps
      fadeAnimation: false, zoomAnimation: false, markerZoomAnimation: false});
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© OpenStreetMap', maxZoom: 18});
    let fired = false; const once = () => { if (!fired) { fired = true; done(); } };
    tiles.on('load', once); setTimeout(once, 15000);  // never wait forever for a tile
    tiles.addTo(map);
    if (el.dataset.map === 'north') {
      const reg = (nm.regional_stations || []).filter(r => r.lat != null), maxRel = Math.max(...reg.map(r => r.mean_relab), 1e-6);
      map.fitBounds(L.latLngBounds(reg.map(r => [r.lat, r.lon])), {padding: [8, 8]});
      reg.forEach(r => { const det = r.detected > 0;
        L.circleMarker([r.lat, r.lon], {radius: det ? 3 + 12 * Math.sqrt(r.mean_relab / maxRel) : 3, color: r.is_ci ? '#d97706' : '#fff', weight: r.is_ci ? 2.5 : 1,
          fillColor: det ? (r.is_ci ? '#fbbf24' : c.habitat === 'marine' ? '#0ea5e9' : '#10b981') : '#94a3b8', fillOpacity: .75}).addTo(map); });
    } else {
      const loc = nm.ci_local_stations || [], all = D.ciSites?.length ? D.ciSites : loc;
      map.fitBounds(L.latLngBounds(all.map(s => [s.lat, s.lon])), {padding: [14, 14]});
      all.filter(a => !loc.some(s => s.name === a.name)).forEach(a =>
        L.circleMarker([a.lat, a.lon], {radius: 4, color: '#fff', weight: 1, fillColor: '#94a3b8', fillOpacity: .8}).addTo(map));
      loc.forEach(s => L.circleMarker([s.lat, s.lon], {radius: 5 + 12 * Math.min(1, Math.sqrt((s.max_relab || 0) / 10)), color: '#fff', weight: 1.5,
        fillColor: s.type === 'Marine' ? '#0ea5e9' : '#10b981', fillOpacity: .8}).addTo(map));
    }
  });
}

function showSheets(list) {
  document.body.classList.add('sheetmode');
  let box = document.getElementById('sheets');
  if (!box) { box = document.createElement('div'); box.id = 'sheets'; document.body.appendChild(box); }
  const one = list.length === 1, i = list[0], n = C.length;
  const opts = C.map((c, k) => `<option value="${k + 1}"${one && k === i ? ' selected' : ''}>${k + 1}. ${esc(c.nickname)}</option>`).join('');
  const nav = one
    ? `<select onchange="location.hash = this.value + '/sheet'">${opts}</select>
       <a class="btn" href="#${(i - 1 + n) % n + 1}/sheet" title="Previous microbe">◀</a>
       <a class="btn" href="#${(i + 1) % n + 1}/sheet" title="Next microbe">▶</a>
       <a class="btn" href="#all/sheet">All ${n}</a>`
    : `<select onchange="document.getElementById('sheet-' + this.value).scrollIntoView({behavior:'smooth'})"><option value="">Jump to…</option>${opts}</select>`;
  box.innerHTML = `<div class="sh-bar noprint">
      <a class="btn sh-name" href="#${one ? i + 1 : ''}" title="Back to the microbe page">⌂ ${one ? esc(C[i].nickname) : 'Home'}</a>
      ${nav}
      <span class="note">Letter, double-sided (flip on long edge), printer's normal margins.</span>
      <button class="btn primary sh-print" id="shPrint" disabled onclick="window.print()">⏳ Loading maps…</button>
    </div>` + list.map(sheetFor).join('');
  let ps = document.getElementById('sheetPage');
  if (!ps) { ps = document.createElement('style'); ps.id = 'sheetPage'; document.head.appendChild(ps); }
  ps.textContent = '@page{size:letter portrait}';  // the printer sets the margins
  document.title = one ? `${C[i].nickname}: printable sheet` : 'Printable microbe sheets';
  window.scrollTo(0, 0);
  drawMaps(box, () => { const b = document.getElementById('shPrint'); if (b) { b.disabled = false; b.textContent = '🖨️ Print'; } });
}
function route() {
  const h = location.hash.match(/^#(\d+|all)\/sheet$/);
  if (h) return showSheets(h[1] === 'all' ? C.map((c, i) => i) : [+h[1] - 1]);
  if (document.body.classList.contains('sheetmode')) location.reload();  // leaving the sheet: back to the normal page
}
window.addEventListener('hashchange', route);
route();
})();
