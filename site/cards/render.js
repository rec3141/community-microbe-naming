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
function homeRow(c) {
  // each site stays on one line with its seasons; lines break only between sites
  const parts = c.home.map(h => `<span class="hs">${esc(h.site)} ${h.seasons.map(ssn).join('')}${h.lab ? ' (grown in the lab)' : ''}</span>`);
  return parts.length ? parts.join(' · ') : 'not found in local samples yet';
}

function microbeFace(c, total) {
  const L = MC.LIFESTYLES[c.lifestyle], H = HAB[c.habitat] || {name: c.habitat, icon: ''};
  const peak = c.peak ? `<span class="peak" title="peak season">${ssn(c.peak)}</span>` : '';
  const attack = a => `<div class="atk"><div class="atk-h">${dots(a.cost)}<b>${esc(a.name)}</b>${kindTag(a.kind)}<span class="dmg">${a.dmg}</span></div>${a.text ? `<div class="atk-t">${esc(a.text)}</div>` : ''}</div>`;
  return `<div class="tcard microbe ${c.habitat} life-${c.lifestyle}" style="--life:${L.color}" data-id="${esc(c.id)}">
  <div class="frame">
    <div class="top"><span class="nm${nameSize(c.name)}">${esc(c.name)}</span>${peak}<span class="hp"><small>HP</small>${c.hp}</span></div>
    <div class="sub"><span>${L.icon} ${esc(L.name)}</span><span>${H.icon} ${H.name}</span><span>${esc(c.envelopeName)}</span></div>
    <div class="art"><img src="${imgSrc(c)}" alt="" loading="lazy"><div class="badges">${c.badges.map(b => `<span title="${esc(MC.BADGES[b].name)}">${MC.BADGES[b].icon}</span>`).join('')}</div></div>
    ${c.ability ? `<div class="abil"><b>✦ ${esc(c.ability.name)}</b> ${esc(c.ability.text)}</div>` : ''}
    <div class="atks">${c.attacks.map(attack).join('')}</div>
    ${wrRow(c)}
    <div class="sci">${esc(c.science)}</div>
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
    <div class="pl-art"><span>${salty ? '🌊' : '💧'}</span><b>${S.icon}</b>${artImg(p.art)}<i class="season-chip">${S.icon}</i></div>
    <div class="pl-rule">${esc(p.text)}</div>
    <div class="pl-homes"><b>Found here then (they get 2 nutrients when fed):</b> ${p.homes.map(h => esc(h.name)).join(', ') || '—'}</div>
    <div class="pl-rule small">Wrong water: at the start of your turn, a ${salty ? 'lake microbe (unless 🧂)' : 'sea microbe'} Active here takes 10 damage.</div>
    <div class="foot"><span class="home">Sampled here in ${esc(p.months.join(' & '))}</span>${total ? `<span class="no">${p.num}/${total}</span>` : ''}</div>
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
