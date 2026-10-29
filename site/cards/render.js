// HTML for card faces, card backs and the "where do the numbers come from" panel.
// Shared by every community; styles are in cards.css. Cards are 63 × 88 mm.
(function (root) {
'use strict';
const MC = root.MicrobeCards;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const dots = n => n ? '<span class="cost">' + '●'.repeat(n) + '</span>' : '<span class="cost free">0</span>';
// smaller type for long names; `extra` counts room taken by a label on the same line (PLACE, EVENT)
const nameSize = (s, extra = 0) => { const n = s.length + extra; return n <= 18 ? '' : n <= 24 ? ' n2' : n <= 29 ? ' n3' : ' n4'; };
const HAB = {marine: {name: 'Sea', icon: '🌊'}, freshwater: {name: 'Lake', icon: '💧'}};
const imgSrc = c => c.img ? `img/${c.img}` : 'img/placeholder.svg';
// card art over the emoji; if the picture is missing it removes itself and the emoji shows
const artImg = src => src ? `<img class="art-img" src="${esc(src)}" alt="" loading="lazy" onerror="this.remove()">` : '';

function kindTag(k) {
  if (k === 'grow') return '';
  const K = MC.KINDS[k]; return `<span class="kind" title="${esc(K.name)}">${K.icon}</span>`;
}
function wrRow(c) {
  const K = MC.KINDS;
  const weak = c.weak ? `${K[c.weak].icon} ×${MC.TUNE.weakMult}` : '—';
  const res = c.immune.length ? c.immune.map(k => `${K[k].icon} 0`).join(' ') + (c.resist ? ` ${K[c.resist].icon} −${MC.TUNE.resist}` : '')
    : c.resist ? `${K[c.resist].icon} −${MC.TUNE.resist}` : '—';
  return `<div class="wr"><span><i>weak</i> ${weak}</span><span><i>resist</i> ${res}</span><span><i>retreat</i> ${c.retreat ? dots(c.retreat) : '0'}</span></div>`;
}
// a season icon with a thin dark outline, so the pale 🌨️ / 🌬️ stay visible on white printed cards
const ssn = k => MC.SEASONS[k] ? `<span class="ssn" title="${MC.SEASONS[k].name}">${MC.SEASONS[k].icon}</span>` : '';
// cells badge: one randomly coloured pixel per million cells (minimum 1) in its biggest local count (seeded by
// the microbe id, so the same card always prints the same pattern)
const DOT_COLORS = ['#f87171', '#fbbf24', '#34d399', '#38bdf8', '#a78bfa', '#f472b6', '#fb923c', '#a3e635'];
function cellsBadge(c) {
  const m = Math.round((c.maxCells || 0) / 1e6), n = Math.max(1, m), G = 16, R2 = (G / 2) ** 2;  // at least 1 dot, so no badge is empty
  let h = 2166136261; for (const ch of c.id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  const spots = [];
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) if ((x + .5 - G / 2) ** 2 + (y + .5 - G / 2) ** 2 <= R2) spots.push([x, y]);
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
  const px = spots.slice(0, Math.min(n, spots.length)).map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${DOT_COLORS[Math.floor(rnd() * DOT_COLORS.length)]}"/>`).join('');
  const t = m ? `About ${c.maxCellsText} cells per litre at most: one dot per million` : 'Fewer than a million cells per litre in any local sample';
  return `<span class="cells b-cells" title="${esc(t)}"><svg viewBox="0 0 ${G} ${G}" shape-rendering="crispEdges">${px}</svg></span>`;
}
function homeRow(c) {
  // each site stays on one line with its seasons; lines break only between sites
  const parts = c.home.map(h => `<span class="hs">${esc(h.site)} ${h.seasons.map(ssn).join('')}${h.lab ? ' (grown in the lab)' : ''}</span>`);
  return parts.length ? parts.join(' · ') : 'not found in local samples yet';
}

function microbeFace(c, total) {
  const L = MC.LIFESTYLES[c.lifestyle], H = HAB[c.habitat] || {name: c.habitat, icon: ''};
  // left of the cartoon: where it lives and when it peaks (badges on the right are its genes)
  const badge = b => `<span class="b-${b}" title="${esc(MC.BADGES[b].name)}">${MC.BADGES[b].icon}</span>`;
  const left = `<span class="b-hab" title="${esc(H.name)} microbe">${H.icon}</span>` + (c.peak ? `<span class="b-season" title="Peaks in ${esc(MC.SEASONS[c.peak].name.toLowerCase())}">${MC.SEASONS[c.peak].icon}</span>` : '') + cellsBadge(c);
  const attack = a => `<div class="atk"><div class="atk-h">${dots(a.cost)}<b>${esc(a.name)}</b>${kindTag(a.kind)}<span class="dmg">${a.dmg}</span></div>${a.text ? `<div class="atk-t">${esc(a.text)}</div>` : ''}</div>`;
  return `<div class="tcard microbe ${c.habitat} life-${c.lifestyle}" style="--life:${L.color}" data-id="${esc(c.id)}">
  <div class="frame">
    <div class="top"><span class="nm${nameSize(c.name)}">${esc(c.name)}</span><span class="hp"><small>HP</small>${c.hp}</span></div>
    <div class="sub"><span>${esc(c.className || c.envelopeName)}</span><span>${L.icon} ${esc(L.name)}</span></div>
    <div class="art"><div class="badges left">${left}${c.badges.filter(b => b === 'tiny').map(badge).join('')}</div><img src="${imgSrc(c)}" alt="" loading="lazy"><div class="badges">${c.badges.filter(b => b !== 'tiny').map(badge).join('')}</div></div>
    <div class="atks">${c.attacks.map(attack).join('')}</div>
    ${wrRow(c)}
    <div class="sci">${esc(c.science)}</div>
    ${c.ability ? `<div class="abil"><b>✦ ${esc(c.ability.name)}</b> ${esc(c.ability.text)}</div>` : ''}
    <div class="foot"><span class="home">${homeRow(c)}</span>${total ? `<span class="no">${c.num}/${total}</span>` : ''}</div>
  </div></div>`;
}

function placeFace(p, total) {
  const S = MC.SEASONS[p.season] || {name: p.season, icon: ''};
  const salty = p.water === 'marine';
  return `<div class="tcard place ${p.water}" data-id="${esc(p.id)}">
  <div class="frame">
    <div class="top"><span class="kindlabel">PLACE</span><span class="nm${nameSize(p.name, 5)}">${esc(p.name)}</span><span class="hp">${ssn(p.season) || S.icon}</span></div>
    <div class="sub"><span>${S.name} · ${esc(p.months.join(', '))}</span><span>${salty ? '🌊 Salt water' : '💧 Fresh water'}</span></div>
    <div class="pl-art"><span>${salty ? '🌊' : '💧'}</span><b>${S.icon}</b>${artImg(p.art)}</div>
    <div class="pl-fx">
      <div class="fx good ${esc(p.season)}" title="${esc(p.text)}"><b>+10 <i class="fxi">${ssn(p.season) || S.icon}</i></b><span class="cap">${esc(S.name.toLowerCase())} microbes hit harder here</span></div>
      <div class="fx bad" title="Wrong water: at the start of your turn, a ${salty ? 'lake microbe Active here takes 10 damage, unless it is 🧂 salt-proof' : 'sea microbe Active here takes 10 damage'}."><b>−10 <i class="fxi">${salty ? '💧' : '🌊'}</i></b><span class="cap">${salty ? 'lake microbes hurt, except 🧂' : 'sea microbes get hurt here'}</span></div>
    </div>
    <div class="pl-homes${p.homes.map(h => h.name).join(', ').length > 280 ? ' long' : ''}"><div><b>Home microbes (+2 ● when fed):</b> ${p.homes.map(h => esc(h.name)).join(', ') || '—'}</div></div>
    <div class="foot"><span class="home"></span>${total ? `<span class="no">${p.num}/${total}</span>` : ''}</div>
  </div></div>`;
}

function eventFace(e, total) {
  return `<div class="tcard event" data-id="${esc(e.id)}">
  <div class="frame">
    <div class="top"><span class="kindlabel">EVENT</span><span class="nm">${esc(e.name)}</span></div>
    <div class="ev-art">${e.icon}${artImg(e.art)}</div>
    <div class="ev-text">${esc(e.text)}</div>
    <div class="sci">${esc(e.why)}</div>
    <div class="foot"><span class="home">Play 1 Event per turn</span>${total ? `<span class="no">${e.num}/${total}</span>` : ''}</div>
  </div></div>`;
}

function face(card, total) {
  return card.type === 'microbe' ? microbeFace(card, total) : card.type === 'place' ? placeFace(card, total) : eventFace(card, total);
}
function back(type, brand, game) {
  const label = {microbe: 'MICROBE', place: 'PLACE', event: 'EVENT'}[type];
  const icon = {microbe: '🦠', place: '🧭', event: '⚡'}[type];
  return `<div class="tcard back back-${type}"><div class="frame"><div class="bk-in"><div class="bk-icon">${icon}</div><div class="bk-game">${esc(game)}</div><div class="bk-type">${label}</div><div class="bk-brand">${esc(brand)}</div></div></div></div>`;
}

// the explanation panel next to a big card
function details(card) {
  if (card.type === 'microbe') {
    const L = MC.LIFESTYLES[card.lifestyle];
    return `<h3>Where the numbers come from</h3>
      <table class="why">${card.stats.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
      ${card.attacks.map(a => `<tr><th>${esc(a.name)}<br><small>${a.cost} ● · ${a.dmg}${a.kind !== 'grow' ? ' · ' + MC.KINDS[a.kind].name : ''}</small></th><td>${esc(a.why)}${a.slot === 2 ? ` <span class="note">Damage and cost from its bloom tier (${card.bloom} of 3)${card.lifestyle === 'hunter' ? '; all hunters share the same Break-In' : ''}.</span>` : ''}</td></tr>`).join('')}
      ${card.ability ? `<tr><th>✦ ${esc(card.ability.name)}</th><td>${esc(card.ability.why)}</td></tr>` : ''}
      ${card.badges.map(b => `<tr><th>${MC.BADGES[b].icon} ${esc(MC.BADGES[b].name)}</th><td>It ${esc(MC.BADGES[b].text)}.</td></tr>`).join('')}
      <tr><th>Peak season</th><td>${card.peak ? `${MC.SEASONS[card.peak].icon} ${MC.SEASONS[card.peak].name}: its biggest count was in a ${MC.SEASONS[card.peak].name.toLowerCase()} sample.` : 'Unknown: the samples it was found in have no date.'}</td></tr>
      </table>`;
  }
  if (card.type === 'place') return `<h3>About this place</h3><p>${card.water === 'marine' ? 'A seawater site' : 'A lake'} sampled in ${esc(card.months.join(' and '))}. The microbes listed were detected in a ${MC.SEASONS[card.season].name.toLowerCase()} sample from here, so they get the home bonus. Places change whenever a microbe is washed out, just as the microbes you find change from place to place and season to season.</p>`;
  return `<h3>The real science</h3><p>${esc(card.why)}</p>`;
}

const API = {face, back, details, microbeFace, placeFace, eventFace, esc};
root.MicrobeRender = API;
})(typeof window !== 'undefined' ? window : globalThis);
