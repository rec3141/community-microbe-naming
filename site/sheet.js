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

// Suggested words for every microbe at once, so the printed set varies: each microbe takes its 8 best
// words, but a word already given to earlier microbes counts for less (and at most 4 times), so common
// habitat words like 'sea' or 'ice' don't fill every sheet. Same picks on one sheet or all of them.
let WORD_PLAN = null;
function wordPlan() {
  if (WORD_PLAN) return WORD_PLAN;
  const uses = new Map(), MAX_USES = 4, key = h => (h.e.roman || '').toLowerCase();  // count by spelling: some words have several entries
  WORD_PLAN = C.map(c => {
    const cands = typeof suggestWords === 'function' && DICT_SHOWN.length ? suggestWords(c, 80) : [];
    const seen = new Set(), pick = cands.filter(h => (uses.get(key(h)) || 0) < MAX_USES)
      .map(h => ({h, v: h.score / (1 + 1.5 * (uses.get(key(h)) || 0))}))
      .sort((a, b) => b.v - a.v).filter(x => !seen.has(key(x.h)) && seen.add(key(x.h))).slice(0, 8).map(x => x.h);
    // never short-change a sheet: top up from its own ranked list, even past the cap
    for (const h of cands) { if (pick.length >= 8) break; if (!pick.some(x => key(x) === key(h))) pick.push(h); }
    pick.forEach(h => uses.set(key(h), (uses.get(key(h)) || 0) + 1));
    return pick;
  });
  return WORD_PLAN;
}

// glossary credit for print: community.js dictionaryCreditHtml with links written out as text
const dictCredit = () => { const h = CM.dictionaryCreditHtml || '', urls = [...h.matchAll(/href="https?:\/\/([^"]+)"/g)].map(m => m[1]);
  return h.replace(/<[^>]+>/g, '').replace(/^Words from the /, '').replace(/\.?\s*$/, '') + (urls.length ? ` (${urls.join(', ')})` : ''); };
// the community's own dialect (CM.dialect, default: the first word of the credit's dialect) vs. words from others
const HOME_DIALECT = CM.dialect || ((CM.dictionaryCreditHtml || '').match(/(\w+) dialect/) || [])[1] || '';
const dialectOf = e => (e.dialect || '').replace(/\s*\(.*$/, '') || (e.source || '').replace(/^.*\(|\)$/g, '');
const otherDialect = e => HOME_DIALECT && !new RegExp(HOME_DIALECT, 'i').test(e.dialect || e.source || '');

// compact copy of the Diversity tab's GTDB tree: this microbe (gold star), its relatives, type strains (T)
function sheetTree(c) {
  const t = D.trees[c.id];
  if (!t) return '<p class="sh-note">No tree available.</p>';
  const leaves = []; let maxX = 0;
  (function walk(n, x) { n._x = x + (n.length || 0); maxX = Math.max(maxX, n._x);
    if (n.children) n.children.forEach(ch => walk(ch, n._x)); else { n._y = leaves.length; leaves.push(n); } })(t.root, 0);
  (function setY(n) { if (n.children) { n.children.forEach(setY); n._y = (n.children[0]._y + n.children[n.children.length - 1]._y) / 2; } })(t.root);
  const W = 340, labelW = 205, rowH = 12.5, H = leaves.length * rowH + 22, sx = (W - labelW - 20) / Math.max(maxX, 1e-6);
  const X = v => 8 + v * sx, Y = v => 8 + v * rowH;
  let s = `<svg viewBox="0 0 ${W} ${H}" class="sh-phylo">`;
  (function draw(n, px) {
    const x = X(n._x), y = Y(n._y);
    s += `<line x1="${X(px)}" y1="${y}" x2="${x}" y2="${y}"/>`;
    if (n.children) {
      s += `<line x1="${x}" y1="${Y(n.children[0]._y)}" x2="${x}" y2="${Y(n.children[n.children.length - 1]._y)}"/>`;
      n.children.forEach(ch => draw(ch, n._x));
    } else {
      // fixed size so the text stays readable; very long names are cut short with …
      const ani = n.ani ? ` · ${(+n.ani).toFixed(1)}%` : '', room = 44 - ani.length;
      let lbl = n.is_target ? `★ ${c.nickname}` : (n.label || n.name).replace(/\s*\[[^\]]*\]\s*$/, '');
      if (lbl.length > room) lbl = lbl.slice(0, room - 1) + '…';
      const cls = n.is_target ? 'tg' : n.is_type ? 'ty' : n.is_user_bin ? 'ub' : '';
      s += `<circle cx="${x}" cy="${y}" r="${n.is_target ? 3.5 : 2.2}" class="${cls}"/>`;
      s += `<text x="${x + 6}" y="${y + 3.5}" class="${cls}">${n.is_type ? `<tspan font-style="italic">${esc(lbl)}</tspan><tspan baseline-shift="super" font-size="6">T</tspan>` : esc(lbl)}${ani}</text>`;
    }
  })(t.root, 0);
  const bar = [0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001].find(b => b * sx <= 60) || 0.001;  // a scale bar that fits
  s += `<line x1="8" y1="${H - 6}" x2="${8 + bar * sx}" y2="${H - 6}"/><text x="${12 + bar * sx}" y="${H - 3}" class="sc">${bar} changes per site</text>`;
  return s + '</svg>';
}

function sheetFor(i) {
  const c = C[i], need = namingNeed(c), L = lineageOf(c), g = GUILDS[c.guild], m = D.meta[c.id] || {};
  const where = [...foundRows(c), ...(c.isolated ? [`grown in the lab from ${esc(c.isolated.site)} water (${esc(c.isolated.season || '')})`] : [])];
  const gen = !need.genus && (window.GENERA || {})[need.genusName];
  const words = wordPlan()[i];
  const SI = window.SERVICE_INFO || {}, es = (D.ecossdb[c.id] || []).slice().sort((a, b) => b.weighted_score - a.weighted_score).slice(0, 4);
  const site = `${location.origin}${location.pathname}#${i + 1}`;
  const head = `<div class="sh-head"><span>${esc(CM.brand || CM.placeName || '')} · ${esc(CM.nativeName || '')}</span><span>Microbe ${i + 1} of ${C.length}</span></div>`;
  // ranks with no Latin name show the code name scientists use for now (e.g. TMED14, sp028352435)
  const tree = L.map(x => { const code = x.ph && !/^\(no name/.test(x.name) ? (x.rank === 'Species' ? x.name.split(' ').pop() : x.name) : '';
    return `<tr><th>${x.rank}</th><td>${x.ph ? `${code ? `<span class="sh-code">${esc(code)}</span> ` : ''}<span class="sh-new">no name yet</span>` : `<i>${esc(x.name.replace(/_[A-Z]+\b/g, ''))}</i>`}</td></tr>`; }).join('');
  const rr = (c.rrna || '').replace(/\d+\s*[×x]\s*/g, '');  // '9× 16S + 9× 23S' -> '16S + 23S'
  // genome as tiles: a big number with a small label, two per row; then rRNA and the ID
  const tiles = [
    [fmt((m.size || 0) / 1e6, 2) + ' M', 'DNA letters'], [fmt(m.completeness) + '%', 'complete'],
    [fmt(m.contamination, 2) + '%', 'contamination'], [m.n_contigs ?? '—', 'pieces (contigs)'],
    [m.n50 ? fmt(m.n50 / 1e3, 0) + ' k' : '—', 'N50 piece size'], [(m.n_genes || 0).toLocaleString('en-CA'), 'genes'],
    [m.hypo_pct != null ? fmt(m.hypo_pct, 0) + '%' : '—', 'genes unknown'], [m.gc != null ? fmt(m.gc * 100, 0) + '%' : '—', 'G + C'],
  ];
  const asm = `<div class="sh-gtiles">${tiles.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
    ${rr ? `<p class="sh-gline">${esc(rr.replace(/\s*rRNA/, ' rRNA'))}</p>` : ''}
    <p class="sh-gline">ID <code>${esc(c.id)}</code></p>`;
  const line = (label, n = 1) => `<div class="sh-fill"><b>${label}</b>${'<span></span>'.repeat(n)}</div>`;
  // two blanks side by side (genus word, species word); a known genus is printed in the first
  const pair = (label, first = '') => `<div class="sh-fill sh-pair"><b>${label}:</b><span${first ? ' class="sh-fixed"' : ''}>${first}</span><span></span></div>`;
  return `
  <section class="sh-page sh-front ${c.habitat}" id="sheet-${i + 1}">
    ${head}
    <div class="sh-title">
      <img src="${img(i)}" alt="">
      <div><h1>${esc(c.nickname)}</h1>
        <div class="sh-pills">
          <span>${c.habitat === 'marine' ? '🌊 Sea microbe' : '💧 Lake microbe'}</span>
          ${c.isolated ? '<span>🔬 Grown in the lab</span>' : ''}
          ${topEnriched().has(i) ? `<span>⭐ ${foldText(ciFold(c))} more common in ${esc(LOCAL)}</span>` : ''}
        </div>
        ${g ? `<p class="sh-guild">${g.icon} <b>${esc(g.name)}</b>: ${esc(g.short)}</p>` : ''}</div>
    </div>
    <div class="sh-top">
      <div><h3>🧬 Family tree</h3><table class="sh-tree">${tree}</table></div>
      <div><h3>🌳 Its closest relatives</h3>${sheetTree(c)}</div>
    </div>
    <p class="sh-credit">Relatives: GTDB tree · ★ this microbe · <i>italic</i><sup>T</sup> type strain, the reference for a named species · %: how much of its DNA matches (ANI).</p>
    <div class="sh-maps">
      <div><h3>📍 Around ${esc(LOCAL)}</h3><div class="sh-map" data-map="local" data-i="${i}"></div></div>
      <div><h3>🌍 The North</h3><div class="sh-map" data-map="north" data-i="${i}"></div></div>
    </div>
    <p class="sh-credit">Bigger dot: more cells per litre · grey: sampled, not found · gold ring: ${esc(LOCAL)} · Maps © OpenStreetMap contributors</p>
    <p class="sh-where"><b>📅 Found:</b> ${where.join('; ') || 'not yet in our water samples'}. ${peak(c)}</p>
    <div class="sh-cols3">
      <div><h3>📖 Its story</h3><p class="sh-story">${esc(c.eco || c.story || '')}</p></div>
      <div class="sh-genome"><h3>🧩 Its genome</h3>${asm}</div>
    </div>
  </section>
  <section class="sh-page sh-back">
    ${head}
    <h2>${esc(c.nickname)}: help name it</h2>
    ${es.length ? `<h3>🌿 What it does for the ecosystem</h3>
      <div class="sh-es">${es.map(x => { const info = SI[x.code] || {};
        const pt = (c.esPoints || {})[x.code];  // narratives.js: this microbe's own point in the category
        return `<div><span class="sh-note">${x.icon} ${esc(info.title || x.short_name)}</span><b class="sh-es-h">${esc(pt ? pt[0] : info.title || x.short_name)}</b><p>${esc(pt ? pt[1] : info.front || x.desc)}</p><p class="sh-note">${x.gene_count} gene${x.gene_count === 1 ? '' : 's'} linked to this</p></div>`; }).join('')}</div>
` : ''}
    <h3>✍️ What are we naming?</h3>
    <p>${need.genus
      ? `It needs a <b>new genus and species</b>: two new words. The genus (first word) starts with a capital letter; the species (second word) is all lowercase.`
      : `It belongs to the genus <i>${esc(need.genusName)}</i>${gen ? `, which means “${esc(gen.gloss)}”` : ''}. It needs a new <b>species</b> name: the second word, all lowercase.`}
      A good name often says where it lives, what it does or what it looks like.</p>
    <div class="sh-split">
      <div class="sh-wcol">
  ${words.length ? `<h3>💡 ${esc(LANG)} words that might fit</h3>
          <p class="sh-note sh-cite">${dictCredit()}${words.some(h => otherDialect(h.e)) ? ` · ‡ = ${esc([...new Set(words.filter(h => otherDialect(h.e)).map(h => dialectOf(h.e)))].join(', '))}` : ''}</p>
          <div class="sh-words">${words.map(h => `<div title="${esc([...h.why].join(' · '))}"><b>${esc(h.e.roman)}</b>${otherDialect(h.e) ? '‡' : ''}${h.e.syllabics ? ` ${esc(h.e.syllabics)}` : ''}<span>${esc(h.e.english)}</span></div>`).join('')}</div>` : ''}
        <div class="sh-lines"><div></div></div>
      </div>
      ${(window.IQ_CONTENT?.principles || []).length ? `<div class="sh-iq">
        <h4>🧭 Which IQ principles does it relate to?</h4>
        ${IQ_CONTENT.principles.map(p => `<div><span class="sh-box"></span><span><b>${esc(p.iu)}</b>${p.syl ? ` <span class="sh-syl">${esc(p.syl)}</span>` : ''} ${esc(p.en)}</span></div>`).join('')}
      </div>` : ''}
    </div>
      <div class="sh-work sh-full">
        <h4>✍️ Our name</h4>
        <div class="sh-pairs">
          ${pair('Name', need.genus ? '' : `<i>${esc(need.genusName)}</i>`)}
          ${pair(esc(LANG))}
          ${pair(esc(CM.languageNative || 'Syllabics'))}
          ${pair('Meaning')}
        </div>
        ${line('Notes:', 2)}
      </div>
    <p class="sh-note sh-url">More about this microbe, and a tool to build the Latin name: ${esc(site)}</p>
  </section>`;
}

// place names on the North map (community.js mapLabels overrides); the local map labels every site
const NORTH_LABELS = CM.mapLabels || [
  {name: 'Resolute', lat: 74.70, lon: -94.83}, {name: 'Chesterfield Inlet', lat: 63.34, lon: -90.70},
  {name: 'Churchill', lat: 58.77, lon: -94.17}, {name: 'Manitoba', lat: 54.0, lon: -98.0, area: true}];
// a label goes right of its dot, else left, above or below: the first side where it fits inside the map
const OFFSET = {right: [5, 0], left: [-5, 0], top: [0, -5], bottom: [0, 5], center: [0, 0]};
function label(map, lat, lon, text, cls = '') {
  let dir = 'center';
  if (!cls) {
    const pt = map.latLngToContainerPoint([lat, lon]), size = map.getSize();
    const w = text.length * 5.6 + 10, h = 14;  // about 7.5 pt bold
    const fits = {right: pt.x + 5 + w < size.x, left: pt.x - 5 - w > 0,
      top: pt.x - w / 2 > 0 && pt.x + w / 2 < size.x && pt.y - 5 - h > 0, bottom: pt.x - w / 2 > 0 && pt.x + w / 2 < size.x && pt.y + 5 + h < size.y};
    dir = ['right', 'left', 'top', 'bottom'].find(d => fits[d]) || 'right';
  }
  L.tooltip({permanent: true, direction: dir, offset: OFFSET[dir], className: 'sh-lbl ' + cls, opacity: 1})
    .setLatLng([lat, lon]).setContent(esc(text)).addTo(map);
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
      NORTH_LABELS.forEach(p => label(map, p.lat, p.lon, p.name, p.area ? 'area' : ''));
    } else {
      const loc = nm.ci_local_stations || [], all = D.ciSites?.length ? D.ciSites : loc;
      map.fitBounds(L.latLngBounds(all.map(s => [s.lat, s.lon])), {padding: [14, 14]});
      all.filter(a => !loc.some(s => s.name === a.name)).forEach(a =>
        L.circleMarker([a.lat, a.lon], {radius: 4, color: '#fff', weight: 1, fillColor: '#94a3b8', fillOpacity: .8}).addTo(map));
      loc.forEach(s => L.circleMarker([s.lat, s.lon], {radius: 5 + 12 * Math.min(1, Math.sqrt((s.max_relab || 0) / 10)), color: '#fff', weight: 1.5,
        fillColor: s.type === 'Marine' ? '#0ea5e9' : '#10b981', fillOpacity: .8}).addTo(map));
      all.forEach(a => label(map, a.lat, a.lon, a.name));  // every sampling site by name
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
  // a story too long for its page loses its last sentences until the page fits
  box.querySelectorAll('.sh-front').forEach(pg => {
    const st = pg.querySelector('.sh-story'); if (!st) return;
    let parts = st.textContent.match(/[^.!?]+[.!?]+(\s+|$)/g) || [st.textContent];
    while (pg.scrollHeight > pg.clientHeight + 1 && parts.length > 1) { parts = parts.slice(0, -1); st.textContent = parts.join('').trim(); }
  });
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
