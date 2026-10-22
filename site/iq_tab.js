// Knowledge tab (site/iq_tab.js): one or two talking points per microbe that link what its
// genes suggest to a community's guiding principles (for Igluligaarjuk: ScIQ, science and Inuit
// Qaujimajatuqangit). Shared by every community; all wording about a community lives in
// communities/<id>/iq.js (window.IQ_CONTENT). The defaults below are neutral.
//
//   renderIQ(panel, ctx)
//     panel   element to fill
//     ctx.id        microbe id (key in IQ_CONTENT.microbes)
//     ctx.microbe   the merged candidate + narrative object (nickname, habitat, ...)
//     ctx.content   window.IQ_CONTENT
//     ctx.community optional window.COMMUNITY (id is used for the storage key and file names)
//     ctx.microbes  optional [{id, nickname}] of all microbes, for the "download all" CSV
//     ctx.site      accepted but not used
//
// The page: a one-sentence hook, then one or two cards. The front of a card is a principle;
// tapping it turns it over to show a clue from the genes and one question to talk about.
// Under each card: an optional note box (no tick boxes). A compact save and
// download line, and one collapsed "about" box with the background, principles and sources.
//
// Notes are kept in localStorage under one key per community (memory fallback when storage is
// blocked) and never leave the device unless someone downloads them.
(function(){
  const CSS = `
.iq .iq-hook{font-size:1.15rem;line-height:1.5;margin:4px 0 0}
.iq .iq-kicker{font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;color:var(--gold);margin:0 0 6px;font-weight:700}
.iq .iq-items{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px}
@media(max-width:640px){.iq .iq-items{grid-template-columns:1fr}}
.iq .iq-item{display:flex;flex-direction:column;gap:8px}
/* the cards reuse the page's .flip card (picture, title, text, hint); only the back's text is styled here */
.iq .iq-item .flip{flex:1}
.iq .flip .back .pn{font-size:.78rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.05em}
.iq .flip .back .clue{color:var(--muted)}
.iq .flip .back .q{font-size:1rem;font-weight:600;line-height:1.45}
.iq textarea,.iq input[type=text]{box-sizing:border-box;width:100%;background:var(--bg);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px 10px;font:inherit;font-size:.9rem}
.iq textarea{min-height:46px;resize:vertical}
.iq textarea:focus,.iq input:focus{outline:none;border-color:var(--gold)}
.iq .iq-foot{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:.85rem;color:var(--muted)}
.iq .iq-foot input[type=text]{max-width:220px;padding:5px 8px}
.iq .iq-foot button{background:none;border:none;color:var(--gold);font:inherit;cursor:pointer;padding:2px 4px;text-decoration:underline}
.iq details.iq-more{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:0 12px;margin:8px 0}
.iq details.iq-more summary{cursor:pointer;padding:9px 0;font-weight:600;font-size:.93rem}
.iq details.iq-more p,.iq details.iq-more ul{font-size:.9rem}
.iq ul.iq-list{margin:6px 0 0;padding-left:18px}
.iq ul.iq-list li{margin:4px 0}
.iq .iq-list b{color:var(--gold)}
.iq .iq-refs li{font-size:.82rem;color:var(--muted)}
.iq .iq-notice{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:.88rem;margin-bottom:14px}
@media(prefers-reduced-motion:reduce){.iq .flip .in{transition:none}}
`;
  function injectCSS(){
    if (document.getElementById('iq-style')) return;
    const s = document.createElement('style'); s.id = 'iq-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label = (content, k, dflt) => { const L = content.labels || {}; return L[k] != null ? L[k] : dflt; };

  // ---------- storage: one object per community, memory fallback ----------
  const MEM = {};
  function storeKey(ctx){ return 'iq:v2:' + ((ctx.community && ctx.community.id) || 'site'); }
  function load(ctx){
    const k = storeKey(ctx);
    if (MEM[k]) return MEM[k];
    let st = null;
    try { st = JSON.parse(localStorage.getItem(k) || 'null'); } catch(e){ st = null; }
    if (!st || typeof st !== 'object') st = {};
    st.student = st.student || ''; st.microbes = st.microbes || {};
    return (MEM[k] = st);
  }
  function save(ctx){
    try { localStorage.setItem(storeKey(ctx), JSON.stringify(MEM[storeKey(ctx)])); return true; } catch(e){ return false; }
  }
  // a: notes per item
  function mstate(st, id){
    const m = st.microbes[id] = st.microbes[id] || {};
    m.a = m.a || {};
    return m;
  }

  // the cards of one microbe: items [{key or keys, clue, q}] (older content: principles [{key, q}])
  function itemsOf(content, mc){
    const P = Object.fromEntries((content.principles || []).map(p => [p.key, p]));
    return (mc.items || mc.principles || []).slice(0, 2).map(x => ({
      clue: x.clue || '', q: x.q || '', img: x.img || '',
      principles: [].concat(x.key || x.keys || []).map(k => P[k]).filter(Boolean)}));
  }

  // ---------- render ----------
  window.renderIQ = function(panel, ctx){
    injectCSS();
    ctx = ctx || {};
    const content = ctx.content || window.IQ_CONTENT || {};
    const microbe = ctx.microbe || {};
    const id = ctx.id || microbe.id;
    const mc = (content.microbes || {})[id];
    const hab = microbe.habitat || '';
    const notice = content.notice || content.draftNote;
    const top = notice ? `<div class="iq-notice">${esc(notice)}</div>` : '';
    if (!mc){
      panel.innerHTML = `<div class="iq ${esc(hab)}">${top}<div class="card"><p class="note">${esc(label(content,'missing','Nothing has been written for this microbe yet.'))}</p></div></div>`;
      return;
    }
    const st = load(ctx), ms = mstate(st, id);
    const items = itemsOf(content, mc);
    const intro = content.intro || {};
    const P = content.principles || [];
    const refs = content.references || [];
    const hint = label(content,'flipHint','tap to turn over'), hintBack = label(content,'flipBackHint','tap to turn back');

    const itemHTML = (it, i) => {
      const name = it.principles.map(p => p.iu).join(' + ') || label(content,'questionWord','Question');
      const gloss = it.principles.map(p => p.en).join('; ');
      // the card's own picture: its img, else content.cardImages ("img/iq/{id}_{n}.jpg"), else its principle's
      const img = it.img || (content.cardImages ? content.cardImages.replace('{id}', id).replace('{n}', i) : '')
        || (it.principles.find(p => p.img) || {}).img;
      return `<div class="iq-item" data-i="${i}">
        <div class="flip" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(name)}${gloss ? ': ' + esc(gloss) : ''}. ${esc(hint)}"><div class="in">
          <div class="face front">
            ${img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
            <div class="t">${esc(name)}</div>
            ${gloss ? `<p>${esc(gloss)}</p>` : ''}
            <div class="hint">${esc(hint)} ↻</div></div>
          <div class="face back">
            <div class="pn">${esc(name)}</div>
            ${it.clue ? `<p class="clue">🔬 ${esc(it.clue)}</p>` : ''}
            <p class="q">${esc(it.q)}</p>
            <div class="hint">${esc(hintBack)} ↻</div></div>
        </div></div>
        <textarea aria-label="${esc(it.q)}" data-a="${i}" placeholder="${esc(label(content,'answerPlaceholder','Notes from the discussion'))}">${esc(ms.a[i] || '')}</textarea>
      </div>`;
    };

    panel.innerHTML = `<div class="iq ${esc(hab)}">
      ${top}
      <div class="card">
        ${label(content,'kicker','') ? `<p class="iq-kicker">${esc(label(content,'kicker',''))}</p>` : ''}
        ${mc.hook ? `<p class="iq-hook">${esc(mc.hook)}</p>` : ''}
        ${label(content,'prompt','') ? `<p class="note" style="margin:14px 0 4px">${esc(label(content,'prompt',''))}</p>` : ''}
        <div class="iq-items">${items.map(itemHTML).join('')}</div>
      </div>
      <div class="card">
        <div class="iq-foot">
          <span data-saved>${esc(label(content,'privacy','Notes are saved only on this device.'))}</span>
          <input type="text" data-student="1" aria-label="Name or group" placeholder="${esc(label(content,'studentPlaceholder','Name or group (optional)'))}" value="${esc(st.student)}">
          <button type="button" data-dl="one">⬇️ ${esc(label(content,'dlOne','This microbe (.txt)'))}</button>
          <button type="button" data-dl="all">⬇️ ${esc(label(content,'dlAll','All microbes (.csv)'))}</button>
        </div>
        ${intro.text || P.length || refs.length ? `<details class="iq-more"><summary>${esc(label(content,'aboutTitle','About this page'))}</summary>
          ${intro.title ? `<p><b>${esc(intro.title)}</b></p>` : ''}
          ${intro.text ? `<p>${esc(intro.text)}</p>` : ''}
          ${(intro.more || []).map(([q,a]) => `<p><b>${esc(q)}</b> ${esc(a)}</p>`).join('')}
          ${intro.respect ? `<p>🤝 ${esc(intro.respect)}</p>` : ''}
          ${P.length ? `<p><b>${esc(label(content,'allPrinciples','The guiding principles'))}</b></p>
            <ul class="iq-list">${P.map(p => `<li><b>${esc(p.iu)}</b>: ${esc(p.en)}${p.note ? ` (${esc(p.note)})` : ''}</li>`).join('')}</ul>
            ${content.principlesSource ? `<p class="note">${esc(content.principlesSource)}</p>` : ''}` : ''}
          ${refs.length ? `<p><b>${esc(label(content,'refsTitle','Sources'))}</b></p>
            <ul class="iq-list iq-refs">${refs.map(r => `<li>${esc(r.cite)}${r.url ? ` <a href="${esc(r.url)}" target="_blank" rel="noopener">link ↗</a>` : ''}</li>`).join('')}</ul>` : ''}
        </details>` : ''}
      </div>
    </div>`;

    // ---------- interactions ----------
    const savedEl = panel.querySelector('[data-saved]');
    const savedTxt = savedEl.textContent;
    let savedTimer;
    const persist = () => {
      const ok = save(ctx);
      savedEl.textContent = ok ? label(content,'savedMsg','Saved on this device.') : label(content,'notSavedMsg','Not saved: this browser blocks storage. Download before you leave the page.');
      clearTimeout(savedTimer); savedTimer = setTimeout(() => { savedEl.textContent = savedTxt; }, 2500);
    };
    // one click (or Enter/Space) turns a card either way, like the page's other cards
    panel.querySelectorAll('.iq .flip').forEach(card => {
      const flip = () => { card.classList.toggle('on'); card.setAttribute('aria-pressed', card.classList.contains('on') ? 'true' : 'false'); };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flip(); } });
    });
    panel.querySelectorAll('textarea[data-a]').forEach(el => el.addEventListener('input', () => { ms.a[el.dataset.a] = el.value; persist(); }));
    const stu = panel.querySelector('input[data-student]');
    stu.addEventListener('input', () => { st.student = stu.value; persist(); });
    panel.querySelector('[data-dl="one"]').addEventListener('click', () => download(fileBase(ctx, st) + '_' + id + '.txt', textExport(ctx, content, st, id, microbe.nickname), 'text/plain'));
    panel.querySelector('[data-dl="all"]').addEventListener('click', () => download(fileBase(ctx, st) + '.csv', csvExport(ctx, content, st), 'text/csv'));
  };

  // ---------- export ----------
  function fileBase(ctx, st){
    const who = (st.student || '').trim().replace(/[^\w-]+/g, '_').slice(0, 40);
    return 'notes_' + ((ctx.community && ctx.community.id) || 'site') + (who ? '_' + who : '');
  }
  function rowsFor(content, st, id, nickname){
    const mc = (content.microbes || {})[id]; if (!mc) return [];
    const ms = mstate(st, id);
    return itemsOf(content, mc).map((it, i) => ({id, nickname, principle: it.principles.map(p => p.iu).join(' + '),
      question: it.q, answer: ms.a[i] || ''}));
  }
  function textExport(ctx, content, st, id, nickname){
    const head = [`${nickname || id} (${id})`, st.student ? `Name/group: ${st.student}` : '', `Saved: ${new Date().toLocaleString()}`, ''];
    return head.concat(rowsFor(content, st, id, nickname).map(r =>
      `[${r.principle}] ${r.question}\n${r.answer || '(no note)'}\n`)).join('\n');
  }
  function csvExport(ctx, content, st){
    const names = Object.fromEntries((ctx.microbes || []).map(m => [m.id, m.nickname]));
    const ids = (ctx.microbes || []).map(m => m.id).filter(i => (content.microbes || {})[i]);
    Object.keys(content.microbes || {}).forEach(i => { if (!ids.includes(i)) ids.push(i); });
    const cell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const out = [['community','name_or_group','microbe_id','microbe','principle','question','note'].join(',')];
    ids.forEach(i => rowsFor(content, st, i, names[i] || i).forEach(r =>
      out.push([(ctx.community && ctx.community.id) || '', st.student, r.id, r.nickname, r.principle, r.question, r.answer].map(cell).join(','))));
    return '﻿' + out.join('\r\n');
  }
  function download(name, text, type){
    try {
      const url = URL.createObjectURL(new Blob([text], {type: type + ';charset=utf-8'}));
      const a = document.createElement('a'); a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch(e){ alert('Download failed: ' + e.message); }
  }
  // exposed for tests and the browser console
  window.renderIQ._export = {csv: csvExport, text: textExport, itemsOf};
})();
