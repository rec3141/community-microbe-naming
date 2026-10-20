#!/usr/bin/env python3
"""Serve the workshop site and a small API that drafts name etymologies with
Claude, keeping the API key (from .env) on this machine.

    python3 serve.py [port] [bind]     # default 8080 127.0.0.1

POST /api/protologue  {saved-name fields}  ->  {etymology, checks, suggested_name}
GET  /api/status                           ->  {ok, model}
"""
import http.server, json, os, sys
import naming_api

HERE = os.path.dirname(os.path.abspath(__file__))
PRIVATE = {".env", "serve.py", "naming_api.py"}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=HERE, **kw)

    def send_json(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path.split("?")[0] == "/api/status":
            try:
                naming_api.api_key()
                return self.send_json(200, {"ok": True, "model": naming_api.MODEL})
            except SystemExit as e:
                return self.send_json(200, {"ok": False, "error": str(e)})
        if os.path.basename(self.path.split("?")[0]) in PRIVATE or "/." in self.path:
            return self.send_error(404)
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/protologue":
            return self.send_error(404)
        try:
            n = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            if not n.get("name"):
                return self.send_json(400, {"error": "missing name"})
            self.send_json(200, naming_api.protologue(n))
        except Exception as e:
            self.send_json(502, {"error": str(e)})


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    bind = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"
    print(f"[INFO] http://{bind}:{port}/index.html  (model {naming_api.MODEL})", flush=True)
    http.server.ThreadingHTTPServer((bind, port), Handler).serve_forever()
