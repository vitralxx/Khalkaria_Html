#!/usr/bin/env python3
"""Folha de prova dos glifos do Bazar, lida do sprite do templates/bazar.template.html.

Cada glifo aparece no tamanho do chip (14 px), no medalhão do card (23 px, em duas
cores de raridade) e ampliado, com quantos itens o usam (data/bazar.json).
Saída: tools/artefatos/saida/glifos-bazar.png (precisa de `pip install resvg-py`)
e .svg ao lado (abre em qualquer navegador, sem dependência).

Uso: python tools/artefatos/folha_glifos.py [prefixo ...]   (sem argumento: categorias + g-*)
"""
import json, os, re, sys
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TPL = os.path.join(RAIZ, 'templates', 'bazar.template.html')
SAIDA = os.path.join(RAIZ, 'tools', 'artefatos', 'saida')

tpl = open(TPL, encoding='utf-8').read()
simbolos = {m.group(2): m.group(1)
            for m in re.finditer(r'(<symbol id="([^"]+)".*?</symbol>)', tpl, flags=re.S)}
CATEGORIAS = ['ico-arma', 'ico-armadura', 'ico-escudo', 'ico-consumivel', 'ico-municao',
              'ico-bugiganga', 'ico-magico', 'ico-material', 'ico-lixo']
prefixos = tuple(sys.argv[1:])
nomes = ([n for n in simbolos if n.startswith(prefixos)] if prefixos
         else [n for n in CATEGORIAS if n in simbolos] + [n for n in simbolos if n.startswith('g-')])
uso = Counter(i.get('glifo') for i in json.load(open(os.path.join(RAIZ, 'data', 'bazar.json'), encoding='utf-8')))

COLS, CW, CH = 6, 230, 96
W, H = COLS * CW + 20, ((len(nomes) + COLS - 1) // COLS) * CH + 20
cel = []
for i, n in enumerate(nomes):
    x, y = 10 + (i % COLS) * CW, 10 + (i // COLS) * CH
    rotulo = n + (f'  ·  {uso[n]}' if uso.get(n) else '')
    cel.append(
        f'<rect x="{x}" y="{y}" width="{CW-8}" height="{CH-8}" rx="8" fill="#17130f" stroke="#2a241c"/>'
        f'<text x="{x+8}" y="{y+16}" font-family="Consolas" font-size="12" fill="#8a8580">{rotulo}</text>'
        f'<use href="#{n}" x="{x+10}" y="{y+40}" width="14" height="14" color="#8a8580"/>'
        + ''.join(f'<rect x="{x+dx}" y="{y+30}" width="34" height="34" rx="9" fill="#221b12" stroke="{c}" stroke-opacity=".5"/>'
                  f'<use href="#{n}" x="{x+dx+5.5}" y="{y+35.5}" width="23" height="23" color="{c}"/>'
                  for dx, c in ((34, '#c084fc'), (76, '#6ee7a0')))
        + f'<use href="#{n}" x="{x+124}" y="{y+22}" width="60" height="60" color="#e8b04a"/>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
       f'<defs>{"".join(simbolos[n] for n in nomes)}</defs><rect width="100%" height="100%" fill="#0e0c0a"/>'
       f'{"".join(cel)}</svg>')
os.makedirs(SAIDA, exist_ok=True)
open(os.path.join(SAIDA, 'glifos-bazar.svg'), 'w', encoding='utf-8').write(svg)
try:
    import resvg_py
    open(os.path.join(SAIDA, 'glifos-bazar.png'), 'wb').write(bytes(resvg_py.svg_to_bytes(svg_string=svg)))
    print(f'{len(nomes)} glifos -> tools/artefatos/saida/glifos-bazar.png')
except ImportError:
    print(f'{len(nomes)} glifos -> tools/artefatos/saida/glifos-bazar.svg (sem resvg-py, sem PNG)')
