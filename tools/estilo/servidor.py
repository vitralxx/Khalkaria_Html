#!/usr/bin/env python3
"""Servidor local da conferência de estilo computado.

Serve a raiz do repo em http://127.0.0.1:8898 (sem cache) e recebe as capturas:

    POST /__captura?rotulo=<rotulo>&nome=<pagina.estado>
         corpo = JSON da captura (tools/estilo/captura.js)
      -> grava tools/testes/estilo/<rotulo>/<nome>.json.gz
         (gzip com mtime 0: mesma captura, mesmos bytes; o diff.py lê direto)

rotulo e nome aceitam só [A-Za-z0-9._-] (sem "..").

Uso:  python tools/estilo/servidor.py [--porta 8898]
Roteiro completo: abrir http://127.0.0.1:8898/tools/estilo/rodar.html?rotulo=antes
"""
import argparse
import gzip
import http.server
import json
import os
import re
import sys
from urllib.parse import urlparse, parse_qs

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAIDA = os.path.join(RAIZ, 'tools', 'testes', 'estilo')
NOME_OK = re.compile(r'^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=RAIZ, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        if self.command == 'POST':
            sys.stderr.write('%s\n' % (fmt % args))

    def _resposta(self, codigo, obj):
        corpo = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(codigo)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def do_POST(self):
        u = urlparse(self.path)
        if u.path != '/__captura':
            return self._resposta(404, {'erro': 'rota desconhecida'})
        q = parse_qs(u.query)
        rotulo = (q.get('rotulo') or [''])[0]
        nome = (q.get('nome') or [''])[0]
        if not NOME_OK.match(rotulo) or not NOME_OK.match(nome) or '..' in rotulo + nome:
            return self._resposta(400, {'erro': 'rotulo/nome inválido'})
        n = int(self.headers.get('Content-Length') or 0)
        corpo = self.rfile.read(n)
        try:
            dado = json.loads(corpo.decode('utf-8'))
        except (UnicodeDecodeError, ValueError) as e:
            return self._resposta(400, {'erro': 'JSON inválido: %s' % e})
        pasta = os.path.join(SAIDA, rotulo)
        os.makedirs(pasta, exist_ok=True)
        destino = os.path.join(pasta, nome + '.json.gz')
        # separadores compactos e uma linha só: o arquivo é dado, não leitura
        texto = json.dumps(dado, ensure_ascii=False, separators=(',', ':')) + '\n'
        with open(destino, 'wb') as f:
            f.write(gzip.compress(texto.encode('utf-8'), compresslevel=9, mtime=0))
        return self._resposta(200, {'ok': True, 'arquivo': os.path.relpath(destino, RAIZ),
                                    'bytes': os.path.getsize(destino)})


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--porta', type=int, default=8898)
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', a.porta), Handler)
    print('servindo %s em http://127.0.0.1:%d' % (RAIZ, a.porta), flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
