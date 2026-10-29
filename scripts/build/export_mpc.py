#!/usr/bin/env python3
"""Export every card as a print-ready PNG for MakePlayingCards.com (poker size).

    python3 scripts/build/export_mpc.py dist/<id> [out_dir, default dist/<id>-mpc] [--ink]

Renders the assembled site's cards.html in headless Chrome and saves, at 300 dpi:
  NN_front_<card-id>.png   one per card, 816 x 1110 px (2.72 x 3.70 in, with 0.12 in bleed)
  back_<type>.png          one back per card type (microbe, place, event)
  manifest.csv             upload order: front file, back file, card name
The cut size is 2.48 x 3.46 in (63 x 88 mm) and the card's frame colour fills the bleed, so no white
edge shows if the cut drifts. Text stays inside MPC's safe area (2.28 x 3.27 in). --ink exports the
white "ink saver" faces instead of the full-colour ones. Needs google-chrome; nothing is installed.
"""
import base64, csv, functools, http.server, json, os, shutil, socket, struct, subprocess, sys, tempfile, threading, time, urllib.request

DPI = 300
BLEED_IN, CUT_IN = (2.72, 3.70), (2.48, 3.46)  # MakePlayingCards poker template
PX = (round(BLEED_IN[0] * DPI), round(BLEED_IN[1] * DPI))  # 816 x 1110


def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


class CDP:
    """Just enough of the Chrome DevTools protocol over a raw websocket (standard library only)."""
    def __init__(self, ws_url):
        host, path = ws_url.split('//', 1)[1].split('/', 1)
        h, p = host.split(':')
        self.s = socket.create_connection((h, int(p)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.send(f'GET /{path} HTTP/1.1\r\nHost: {host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n'
                    f'Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.s.recv(4096)
        self.buf, self.n = buf.split(b'\r\n\r\n', 1)[1], 0

    def _rx(self, n):
        while len(self.buf) < n:
            self.buf += self.s.recv(1 << 20)
        d, self.buf = self.buf[:n], self.buf[n:]
        return d

    def _recv(self):
        data = b''
        while True:
            b1, b2 = self._rx(2)
            n = b2 & 127
            if n == 126: n = struct.unpack('>H', self._rx(2))[0]
            elif n == 127: n = struct.unpack('>Q', self._rx(8))[0]
            data += self._rx(n)
            if b1 & 0x80:
                return json.loads(data)

    def call(self, method, **params):
        self.n += 1
        p = json.dumps({'id': self.n, 'method': method, 'params': params}).encode()
        m, n = os.urandom(4), len(p)
        head = bytes([0x81]) + (bytes([0x80 | n]) if n < 126 else bytes([0x80 | 126]) + struct.pack('>H', n) if n < 65536
                                else bytes([0x80 | 127]) + struct.pack('>Q', n))
        self.s.sendall(head + m + bytes(b ^ m[i % 4] for i, b in enumerate(p)))
        while True:
            r = self._recv()
            if r.get('id') == self.n:
                if 'error' in r:
                    raise RuntimeError(f"{method}: {r['error']}")
                return r.get('result', {})

    def js(self, expr):
        r = self.call('Runtime.evaluate', expression=expr, returnByValue=True, awaitPromise=True)
        if 'exceptionDetails' in r:
            raise RuntimeError(r['exceptionDetails'].get('exception', {}).get('description', r['exceptionDetails']))
        return r['result'].get('value')


# Builds one bleed-sized box per card face (and one per back type) on an otherwise empty page.
LAYOUT_JS = r"""(async ink => {
  const R = window.MicrobeRender, RU = window.MicrobeRules, CM = window.COMMUNITY || {};
  const D = window.CARD_DECK, cards = [...D.microbes, ...D.places, ...D.events], total = cards.length, brand = CM.brand || 'Microbes';
  document.body.innerHTML = '';
  const css = document.createElement('style');
  // zoom makes 1 in = 100 CSS px (x3 device px = 300 dpi), so every box is a whole number of CSS px:
  // Chrome rounds screenshot clips to whole CSS px. Each box is the bleed size plus 0.1 in all round
  // (all in the frame colour), so the 816 x 1110 capture from its middle has clean edges.
  css.textContent = `body{margin:0;background:#fff}
    .zoomed{zoom:calc(100 / 96)}
    .mpc{width:calc(%(bw)sin + .2in);height:calc(%(bh)sin + .2in);display:flex;align-items:center;justify-content:center;margin:0 0 .2in}
    .mpc>.tcard{width:%(cw)sin;height:%(ch)sin;border-radius:0;box-shadow:none}`;
  document.head.appendChild(css);
  const wrap = document.createElement('div'); wrap.className = ink ? 'zoomed ink' : 'zoomed'; document.body.appendChild(wrap);
  const out = [];
  const add = (html, name, file) => {
    const d = document.createElement('div'); d.className = 'mpc'; d.innerHTML = html.replace(/loading="lazy"/g, 'loading="eager"');
    wrap.appendChild(d);
    d.style.background = getComputedStyle(d.firstElementChild).backgroundColor;  // the frame colour fills the bleed
    out.push({file, name});
  };
  cards.forEach((c, i) => add(R.face(c, total), c.name, `${String(i + 1).padStart(2, '0')}_front_${c.id}.png`));
  const types = [...new Set(cards.map(c => c.type))];
  types.forEach(t => add(R.back(t, brand, RU.GAME_NAME), `${t} back`, `back_${t}.png`));
  await Promise.all([...document.images].map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  await document.fonts.ready;
  return {out, backs: Object.fromEntries(cards.map((c, i) => [i, `back_${c.type}.png`]))};
})(%(ink)s)"""


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    ink = '--ink' in sys.argv
    if not args:
        sys.exit(__doc__)
    site = os.path.abspath(args[0])
    # default next to the site, not inside it, so deploy.sh never uploads the print files
    out = os.path.abspath(args[1] if len(args) > 1 else site.rstrip('/') + '-mpc')
    if not os.path.isfile(os.path.join(site, 'cards.html')):
        sys.exit(f'[ERROR] no cards.html in {site}: run assemble_site.sh first')
    os.makedirs(out, exist_ok=True)

    port, dport = free_port(), free_port()
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    handler = functools.partial(Quiet, directory=site)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    prof = tempfile.mkdtemp(prefix='mpc-chrome-')
    chrome = subprocess.Popen(['google-chrome', '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
                               f'--remote-debugging-port={dport}', f'--user-data-dir={prof}', 'about:blank'],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{dport}/json'))
                break
            except OSError:
                time.sleep(.1)
        cdp = CDP(next(t for t in tabs if t['type'] == 'page')['webSocketDebuggerUrl'])
        cdp.call('Emulation.setDeviceMetricsOverride', width=1000, height=1200, deviceScaleFactor=DPI / 100, mobile=False)
        cdp.call('Page.enable')
        cdp.call('Page.navigate', url=f'http://127.0.0.1:{port}/cards.html')
        for _ in range(200):
            time.sleep(.1)
            if cdp.js("document.readyState === 'complete' && !!window.CARD_DECK"):
                break
        res = cdp.js(LAYOUT_JS % {'bw': BLEED_IN[0], 'bh': BLEED_IN[1], 'cw': CUT_IN[0], 'ch': CUT_IN[1],
                                  'ink': 'true' if ink else 'false'})
        rects = cdp.js("[...document.querySelectorAll('.mpc')].map(e => { const r = e.getBoundingClientRect(); "
                       "return [r.left + scrollX, r.top + scrollY, r.width, r.height]; })")
        pad = 10  # CSS px (0.1 in at 100 CSS px per inch) of extra frame colour around each bleed box
        w, h = round(BLEED_IN[0] * 100), round(BLEED_IN[1] * 100)  # 272 x 370 CSS px = 816 x 1110 device px
        for item, (x, y, _, _) in zip(res['out'], rects):
            shot = cdp.call('Page.captureScreenshot', format='png', captureBeyondViewport=True,
                            clip={'x': round(x) + pad, 'y': round(y) + pad, 'width': w, 'height': h, 'scale': 1})
            with open(os.path.join(out, item['file']), 'wb') as f:
                f.write(base64.b64decode(shot['data']))
        fronts = [o for o in res['out'] if '_front_' in o['file']]
        with open(os.path.join(out, 'manifest.csv'), 'w', newline='') as f:
            w = csv.writer(f)
            w.writerow(['front', 'back', 'card'])
            for i, o in enumerate(fronts):
                w.writerow([o['file'], res['backs'][str(i)], o['name']])
        print(f'[INFO] {len(fronts)} fronts and {len(res["out"]) - len(fronts)} backs, {PX[0]} x {PX[1]} px at {DPI} dpi -> {out}')
    finally:
        chrome.terminate()
        srv.shutdown()
        shutil.rmtree(prof, ignore_errors=True)


if __name__ == '__main__':
    main()
