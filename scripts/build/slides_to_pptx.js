// Build a PowerPoint deck from the JSON that slides_to_json.py makes from an HTML slide deck.
//   python3 scripts/build/slides_to_json.py communities/igluligaarjuk/data_sovereignty.html > slides.json
//   NODE_PATH=<dir with node_modules/pptxgenjs> node scripts/build/slides_to_pptx.js slides.json out.pptx [place]
// The HTML deck stays the source; this only re-lays its blocks onto 16:9 PowerPoint slides,
// with the speaker notes carried over. pptxgenjs is not a repo dependency: install it anywhere
// (npm install pptxgenjs) and point NODE_PATH at that node_modules.
const fs = require('fs');
const pptxgen = require('pptxgenjs');

const [, , IN, OUT, PLACE = 'Igluligaarjuk'] = process.argv;
const deck = JSON.parse(fs.readFileSync(IN, 'utf8'));

// Colours from the web deck: deep sea navy, sea blue, lake green, gold, rose, ice.
const COL = {
  ink: '0F172A', navy: '0B2A3F', sea: '0369A1', lake: '047857', gold: 'B45309', amber: 'F59E0B',
  rose: 'BE123C', slate: '475569', ice: 'EEF4F8', line: 'CBD5E1', white: 'FFFFFF',
  seaTint: 'E6F1F8', lakeTint: 'E7F5EF', goldTint: 'FEF3C7', roseTint: 'FCE8EC',
};
const FONT = 'Arial';
const SYL_FONT = 'Euphemia';            // Windows' syllabics font; Mac falls back to Euphemia UCAS
const W = 13.333, H = 7.5, X0 = 0.6, CW = W - 2 * X0, YMAX = 6.85;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.title = deck.title;
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };

pres.defineSlideMaster({
  title: 'TITLE',
  background: { color: COL.navy },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: X0, y: 2.2, w: CW, h: 1.4, fontSize: 44, bold: true, color: COL.white, fontFace: FONT, valign: 'top', align: 'left', margin: 0 }, text: '' } },
  ],
});
pres.defineSlideMaster({
  title: 'CONTENT',
  background: { color: COL.white },
  margin: [0.5, 0.6, 0.6, 0.6],
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: X0, y: 0.72, w: CW, h: 1.2, fontSize: 32, bold: true, color: COL.ink, fontFace: FONT, valign: 'top', align: 'left', margin: 0 }, text: '' } },
    { text: { text: `Our waters, our say · ${PLACE}`, options: { x: X0, y: 7.05, w: 7, h: 0.3, fontSize: 10, color: COL.slate, fontFace: FONT, margin: 0 } } },
  ],
  slideNumber: { x: W - X0 - 0.6, y: 7.05, w: 0.6, h: 0.3, fontSize: 10, color: COL.slate, fontFace: FONT, align: 'right' },
});

// --- text helpers ---------------------------------------------------------------------
// Split a string into runs so syllabics get a font that has them.
function runs(str, opts = {}) {
  return str.split(/([᐀-ᙿ]+)/).filter(Boolean).map(t => ({
    text: t, options: /[᐀-ᙿ]/.test(t) ? { ...opts, fontFace: SYL_FONT } : { ...opts },
  }));
}
// Rough height of wrapped text: Arial averages a little over 0.5 em per character.
function textH(str, pt, w, lineGap = 1.2, em = 0.53) {
  const perLine = Math.max(8, Math.floor(w / (pt * em / 72)));
  const lines = String(str).split('\n').reduce((n, l) => n + Math.max(1, Math.ceil(l.length / perLine)), 0);
  return lines * pt * lineGap / 72;
}
function bulletsH(items, pt, w) {
  return items.reduce((h, t) => h + textH(t, pt, w - 0.3) + 0.08, 0);
}
function tb(slide, content, o) {
  slide.addText(content, { fontFace: FONT, color: COL.ink, margin: 0, valign: 'top', isTextBox: true, ...o });
}
function card(slide, x, y, w, h, fill, line, name) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line || fill, width: line ? 1.5 : 0 }, objectName: name,
  });
}
const VARIANT = {
  fresh: { fill: COL.lakeTint, head: COL.lake },
  marine: { fill: COL.seaTint, head: COL.sea },
  rose: { fill: COL.roseTint, head: COL.rose },
  pick: { fill: COL.goldTint, head: COL.gold },
  '': { fill: COL.ice, head: COL.navy },
};

// --- block renderers: each takes (slide, block, y) and returns the next y ------------
const PAD = 0.22, GAP = 0.3;

// A card's text goes in one text frame (letter, title, quote, paragraphs, bullets, then any
// small print), so lines flow instead of stacking boxes that can overlap.
function boxParas(b, size, color) {
  const out = [];
  const add = (text, o) => out.push({ text, options: { breakLine: true, paraSpaceAfter: 6, ...o } });
  if (b.letter) add(b.letter, { fontSize: 11, bold: true, color: COL.slate, charSpacing: 1, paraSpaceAfter: 2 });
  if (b.title) runs(b.title, { fontSize: size + 2, bold: true, color }).forEach((r, i, all) =>
    out.push({ text: r.text, options: { ...r.options, breakLine: i === all.length - 1, paraSpaceAfter: 6 } }));
  if (b.quote) add(b.quote, { fontSize: size + 1, italic: true });
  const mark = { good: ['Good: ', COL.lake], bad: ['Downside: ', COL.rose] };
  b.paras.filter(p => p.kind !== 'small').forEach(p => {
    if (mark[p.kind]) {
      out.push({ text: mark[p.kind][0], options: { fontSize: size, bold: true, color: mark[p.kind][1] } });
      add(p.text, { fontSize: size });
    } else add(p.text, { fontSize: size });
  });
  b.bullets.forEach(t => add(t, { fontSize: size, bullet: { indent: 15 }, paraSpaceAfter: 4 }));
  b.paras.filter(p => p.kind === 'small').forEach(p => add(p.text, { fontSize: size - 1, color: COL.slate, paraSpaceBefore: 6 }));
  if (out.length) out[out.length - 1].options.breakLine = false;
  return out;
}
function boxContentH(b, w, size) {
  const iw = w - 2 * PAD;
  let h = 2 * PAD;
  if (b.letter) h += 0.25;
  if (b.title) h += textH(b.title, size + 2, iw, 1.2, 0.6) + 0.08;
  if (b.quote) h += textH(b.quote, size + 1, iw) + 0.08;
  b.paras.forEach(p => { h += textH((p.kind === 'good' ? 'Good: ' : p.kind === 'bad' ? 'Downside: ' : '') + p.text, size, iw) + 0.08; });
  b.bullets.forEach(t => { h += textH(t, size, iw - 0.25) + 0.06; });
  return h;
}
function drawBox(slide, b, x, y, w, h, size) {
  const v = VARIANT[b.variant] || VARIANT[''];
  card(slide, x, y, w, h, v.fill, b.variant === 'pick' ? COL.amber : null, `box ${b.title}`);
  tb(slide, boxParas(b, size, v.head), { x: x + PAD, y: y + PAD, w: w - 2 * PAD, h: h - 2 * PAD, fit: 'shrink' });
  if (b.variant === 'pick') {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + w - 2.05, y: y - 0.17, w: 1.85, h: 0.34, rectRadius: 0.17, fill: { color: COL.amber }, line: { color: COL.amber, width: 0 }, objectName: 'suggestion badge' });
    tb(slide, '★ Our suggestion', { x: x + w - 2.05, y: y - 0.17, w: 1.85, h: 0.34, fontSize: 12, bold: true, color: COL.ink, align: 'center', valign: 'middle' });
  }
}
function row(slide, boxes, y, size) {
  const n = boxes.length, w = (CW - GAP * (n - 1)) / n;
  const h = Math.max(...boxes.map(b => boxContentH(b, w, size)));
  boxes.forEach((b, i) => drawBox(slide, b, X0 + i * (w + GAP), y, w, h, size));
  return y + h + GAP;
}

const R = {
  lead(slide, b, y) {
    const h = textH(b.text, 22, CW);
    tb(slide, runs(b.text), { x: X0, y, w: CW, h, fontSize: 22, color: COL.ink });
    return y + h + 0.2;
  },
  small(slide, b, y) {
    const h = textH(b.text, 14, CW);
    tb(slide, b.text, { x: X0, y, w: CW, h, fontSize: 14, color: COL.slate });
    return y + h + 0.15;
  },
  cols(slide, b, y) { return row(slide, b.boxes, y, b.boxes.length > 2 ? 16 : 18); },
  options(slide, b, y) { return row(slide, b.items, y + 0.15, 16); },
  chain(slide, b, y) {
    const n = b.steps.length, aw = 0.4, w = (CW - aw * (n - 1)) / n, h = 2.2;
    b.steps.forEach((s, i) => {
      const x = X0 + i * (w + aw);
      card(slide, x, y, w, h, COL.ice, null, `step ${s.title}`);
      tb(slide, s.icon, { x, y: y + 0.2, w, h: 0.6, fontSize: 30, align: 'center' });
      tb(slide, s.title, { x: x + 0.15, y: y + 0.85, w: w - 0.3, h: 0.4, fontSize: 18, bold: true, align: 'center', color: COL.navy });
      tb(slide, s.text, { x: x + 0.15, y: y + 1.3, w: w - 0.3, h: 0.8, fontSize: 14, align: 'center', color: COL.slate });
      if (i < n - 1) tb(slide, '→', { x: x + w, y: y + h / 2 - 0.25, w: aw, h: 0.5, fontSize: 24, align: 'center', color: COL.sea, valign: 'middle' });
    });
    return y + h + 0.3;
  },
  answers(slide, b, y) {
    const tint = { yes: [COL.lakeTint, COL.lake], cond: [COL.goldTint, COL.gold], no: [COL.roseTint, COL.rose] };
    const n = b.items.length, w = (CW - GAP * (n - 1)) / n, h = 1.4;
    b.items.forEach((a, i) => {
      const [fill, line] = tint[a.kind] || [COL.ice, COL.navy];
      const x = X0 + i * (w + GAP);
      card(slide, x, y, w, h, fill, line, `answer ${a.title}`);
      tb(slide, a.title, { x, y: y + 0.25, w, h: 0.55, fontSize: 24, bold: true, align: 'center', color: line });
      tb(slide, a.text, { x, y: y + 0.85, w, h: 0.4, fontSize: 15, align: 'center', color: COL.slate });
    });
    return y + h + 0.3;
  },
  note(slide, b, y) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y, w: CW, h: 0.7, rectRadius: 0.1, fill: { color: COL.white }, line: { color: COL.slate, width: 1.25, dashType: 'dash' }, objectName: 'note' });
    tb(slide, b.text, { x: X0, y, w: CW, h: 0.7, fontSize: 20, bold: true, align: 'center', valign: 'middle' });
    return y + 0.7 + 0.3;
  },
  principles(slide, b, y) {
    const cols = 2, w = (CW - GAP) / cols, h = 1.3;
    b.items.forEach((p, i) => {
      const x = X0 + (i % cols) * (w + GAP), yy = y + Math.floor(i / cols) * (h + 0.2);
      card(slide, x, yy, w, h, COL.ice, null, `principle ${p.iu}`);
      tb(slide, [
        { text: p.syl + '  ', options: { fontFace: SYL_FONT, color: COL.gold, bold: true } },
        { text: p.iu, options: { bold: true, color: COL.navy } },
      ], { x: x + PAD, y: yy + 0.15, w: w - 2 * PAD, h: 0.4, fontSize: 16 });
      tb(slide, p.en, { x: x + PAD, y: yy + 0.8, w: w - 2 * PAD, h: 0.4, fontSize: 15, color: COL.slate });
    });
    return y + Math.ceil(b.items.length / cols) * (h + 0.2) + 0.1;
  },
  gate(slide, b, y) {
    const dw = 3.0, w = (CW - dw - 2 * GAP) / 2, size = 16;
    const h = Math.max(boxContentH(b.left, w, size), boxContentH(b.right, w, size), 2.6);
    drawBox(slide, b.left, X0, y, w, h, size);
    const dx = X0 + w + GAP;
    card(slide, dx, y, dw, h, COL.goldTint, COL.amber, 'community review');
    tb(slide, b.door.icon, { x: dx, y: y + 0.25, w: dw, h: 0.6, fontSize: 30, align: 'center' });
    tb(slide, b.door.title, { x: dx + 0.15, y: y + 0.9, w: dw - 0.3, h: 0.4, fontSize: 18, bold: true, align: 'center', color: COL.gold });
    tb(slide, b.door.text, { x: dx + 0.2, y: y + 1.35, w: dw - 0.4, h: h - 1.5, fontSize: 15, align: 'center' });
    drawBox(slide, b.right, dx + dw + GAP, y, w, h, size);
    return y + h + GAP;
  },
  why(slide, b, y) {
    const m = b.text.match(/^(Why [A-C]:)\s*(.*)$/);
    const h = textH(b.text, 17, CW);
    tb(slide, m ? [{ text: m[1] + ' ', options: { bold: true, color: COL.gold } }, { text: m[2] }] : b.text,
      { x: X0, y, w: CW, h, fontSize: 17 });
    return y + h + 0.15;
  },
  draft(slide, b, y) {
    const h = 0.5;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X0, y, w: CW, h, rectRadius: 0.08, fill: { color: COL.goldTint }, line: { color: COL.amber, width: 1.25, dashType: 'dash' }, objectName: 'first draft note' });
    tb(slide, '📝 ' + b.text, { x: X0 + 0.2, y, w: CW - 0.4, h, fontSize: 14, valign: 'middle' });
    return y + h + 0.2;
  },
  table(slide, b, y) {
    const head = b.head.map(t => ({ text: t.toUpperCase(), options: { bold: true, color: COL.gold, fontSize: 13, fill: { color: COL.white } } }));
    const rows = b.rows.map(r => r.map((t, i) => ({ text: t, options: { bold: i === 0, fontSize: 16 } })));
    const h = 0.5 * (rows.length + 1);
    slide.addTable([head, ...rows], {
      x: X0, y, w: CW, colW: [3.6, CW - 3.6], objectName: 'suggestions table', fontFace: FONT, color: COL.ink, valign: 'middle',
      border: { type: 'solid', pt: 0.75, color: COL.line }, rowH: 0.5, margin: [0.05, 0.12, 0.05, 0.12],
    });
    return y + h + 0.3;
  },
  sources(slide, b, y) {
    const h = bulletsH(b.items, 14, CW);
    tb(slide, b.items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < b.items.length - 1 } })),
      { x: X0, y, w: CW, h, fontSize: 14, paraSpaceAfter: 6 });
    return y + h + 0.2;
  },
  stats(slide, b, y) {
    const n = b.items.length, w = (CW - GAP * (n - 1)) / n, h = 1.2;
    b.items.forEach((s, i) => {
      const x = X0 + i * (w + GAP);
      card(slide, x, y, w, h, COL.ice, null, `stat ${s.v}`);
      tb(slide, s.v, { x, y: y + 0.15, w, h: 0.55, fontSize: 28, bold: true, align: 'center', color: COL.gold });
      tb(slide, s.l, { x: x + 0.1, y: y + 0.72, w: w - 0.2, h: 0.4, fontSize: 13, align: 'center', color: COL.slate });
    });
    return y + h + 0.3;
  },
};

// --- slides -------------------------------------------------------------------------
deck.slides.forEach((s, i) => {
  if (i === 0) {
    const slide = pres.addSlide({ masterName: 'TITLE' });
    tb(slide, runs(s.kicker), { x: X0, y: 1.5, w: CW, h: 0.45, fontSize: 16, bold: true, color: COL.amber, charSpacing: 1 });
    slide.addText(s.title, { placeholder: 'title' });
    let y = 3.4;
    s.blocks.filter(b => b.type === 'lead').forEach(b => {
      const h = textH(b.text, 22, CW - 1);
      tb(slide, b.text, { x: X0, y, w: CW - 1, h, fontSize: 22, color: 'DCE7F0' });
      y += h + 0.25;
    });
    if (s.notes) slide.addNotes(s.notes);
    return;
  }
  const slide = pres.addSlide({ masterName: 'CONTENT' });
  tb(slide, s.kicker.toUpperCase(), { x: X0, y: 0.35, w: CW, h: 0.32, fontSize: 13, bold: true, color: COL.sea, charSpacing: 1.5 });
  slide.addText(s.title, { placeholder: 'title' });
  let y = 0.72 + textH(s.title, 32, CW, 1.15, 0.56) + 0.35;
  s.blocks.forEach(b => {
    if (!R[b.type]) throw new Error(`no renderer for block type ${b.type}`);
    y = R[b.type](slide, b, y);
  });
  if (y > YMAX + 0.3) console.warn(`[WARN] slide ${i + 1} may overflow (ends at ${y.toFixed(2)} in)`);
  if (s.notes) slide.addNotes(s.notes);
});

pres.writeFile({ fileName: OUT }).then(f => console.log(`[INFO] wrote ${f}`));
