#!/usr/bin/env python3
"""Read an HTML slide deck (communities/<id>/*.html, the .slide format of data_sovereignty.html)
and print its content as JSON, one object per slide, for slides_to_pptx.js.
    python3 scripts/build/slides_to_json.py communities/igluligaarjuk/data_sovereignty.html > slides.json
Each slide: {kicker, title, blocks: [...], notes}. Block types follow the deck's CSS classes:
lead, chain, cols (boxes), answers, note (the .silence line), principles, gate, options, why,
draft, table, sources, small."""
import json
import re
import sys

import lxml.html


def text(el):
    """Visible text of an element, whitespace collapsed."""
    return re.sub(r'\s+', ' ', el.text_content()).strip() if el is not None else ''


def cls(el):
    return (el.get('class') or '').split()


def box(el):
    """A .box/.option card: heading, paragraphs, bullets, colour variant."""
    h = el.find('.//h3')
    return {
        'variant': next((c for c in cls(el) if c in ('marine', 'fresh', 'rose', 'pick')), ''),
        'letter': text(el.find('.//div[@class="letter"]')),
        'title': text(h),
        'quote': text(el.find('.//blockquote')),
        'paras': [{'text': text(p), 'kind': (p.get('class') or '')} for p in el.findall('.//p')],
        'bullets': [text(li) for li in el.findall('.//li')],
    }


def blocks(slide):
    out = []
    for el in slide:
        c, tag = cls(el), el.tag
        if tag in ('span', 'h1', 'h2', 'aside'):
            continue
        if tag == 'p' and 'lead' in c:
            out.append({'type': 'lead', 'text': text(el)})
        elif tag == 'p' and 'why' in c:
            out.append({'type': 'why', 'text': text(el)})
        elif tag == 'p' and 'draft' in c:
            out.append({'type': 'draft', 'text': text(el).lstrip('📝 ').strip()})
        elif tag == 'p':
            out.append({'type': 'small', 'text': text(el)})
        elif 'chain' in c:
            out.append({'type': 'chain', 'steps': [
                {'icon': text(s.find('.//span[@class="ico"]')), 'title': text(s.find('.//b')),
                 'text': text(s.findall('.//span')[-1])} for s in el.findall('div[@class="step"]')]})
        elif 'two-col' in c or 'three-col' in c:
            out.append({'type': 'cols', 'boxes': [box(b) for b in el if 'box' in cls(b)]})
        elif 'answers' in c:
            out.append({'type': 'answers', 'items': [
                {'kind': cls(a)[-1], 'title': (a.text or '').strip(), 'text': text(a.find('small'))} for a in el]})
        elif 'silence' in c:
            out.append({'type': 'note', 'text': text(el)})
        elif 'principles' in c:
            out.append({'type': 'principles', 'items': [
                {'syl': text(p.find('span[@class="syl"]')), 'iu': text(p.find('span[@class="iu"]')),
                 'en': text(p.find('span[@class="en"]'))} for p in el]})
        elif 'gate' in c:
            kids = list(el)
            door = kids[1]
            out.append({'type': 'gate', 'left': box(kids[0]), 'right': box(kids[2]),
                        'door': {'icon': text(door.find('span[@class="ico"]')), 'title': text(door.find('b')),
                                 'text': text(door.findall('span')[-1])}})
        elif 'options' in c:
            out.append({'type': 'options', 'items': [box(o) for o in el]})
        elif tag == 'table':
            out.append({'type': 'table', 'head': [text(th) for th in el.findall('.//th')],
                        'rows': [[text(td) for td in tr.findall('td')] for tr in el.findall('.//tbody/tr')]})
        elif tag == 'ul' and 'sources' in c:
            out.append({'type': 'sources', 'items': [text(li) for li in el.findall('li')]})
        elif 'box' in c:
            out.append({'type': 'cols', 'boxes': [box(el)]})
        elif 'stat-row' in c:
            out.append({'type': 'stats', 'items': [
                {'v': text(p.find('div[@class="v"]')), 'l': text(p.find('div[@class="l"]'))} for p in el]})
    return out


def main(path):
    doc = lxml.html.parse(path).getroot()
    slides = []
    for s in doc.find_class('slide'):
        title = s.find('h1') if s.find('h1') is not None else s.find('h2')
        notes = s.find('aside')
        slides.append({
            'kicker': text(s.find('span')) if 'kicker' in cls(s.find('span')) else '',
            'title': text(title),
            'blocks': blocks(s),
            'notes': text(notes),
        })
    json.dump({'title': text(doc.find('.//title')), 'slides': slides}, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main(sys.argv[1])
