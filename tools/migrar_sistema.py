#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Migração pontual: pages/sistema.html -> data/sistema.json + template.

Roda uma vez. Depois disso a fonte é data/sistema.json e a página é artefato
de tools/gerar_sistema.py, como as demais (CLAUDE.md §4).

Desfaz as transformações de build antes de gravar o template (sidebar vira
<!--SIDEBAR-->, .webp volta a .png, ids de h2/h3 saem) para que
gerador + shell reproduzam a página byte-a-byte.
"""
import json, os, re

TOOLS = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(TOOLS)
PAGINA = os.path.join(RAIZ, 'pages', 'sistema.html')
TPL = os.path.join(RAIZ, 'templates', 'sistema.template.html')
JSON_OUT = os.path.join(RAIZ, 'data', 'sistema.json')

RE_SECAO = re.compile(
    r'<section class="category-section cat-([a-z-]+)" id="([a-z-]+)">(.*?)\n(\s*)</section>', re.S)
RE_CABECA = re.compile(
    r'(\s*<div class="category-header">\s*<div class="category-icon">(.*?)</div>\s*'
    r'<h2[^>]*>(.*?)</h2>\s*</div>)', re.S)


def desfaz_build(html):
    """Reverte o que tools/shell.py injeta, para o template ser a fonte limpa."""
    html = re.sub(r'[ \t]*<nav class="sidebar">.*?</nav>', '        <!--SIDEBAR-->',
                  html, count=1, flags=re.S)
    html = re.sub(r'(<img\b[^>]*\bsrc="[^"]+)\.webp(")', r'\1.png\2', html)
    html = re.sub(r'<(h[23]) id="[^"]*"', r'<\1', html)
    return html


def fatia_subsecoes(corpo):
    """Corpo de uma categoria -> lista de pedaços: subseções + texto solto."""
    pedacos, pos = [], 0
    for m in re.finditer(r'<div class="subsection" id="([a-z0-9-]+)">', corpo):
        ini = m.start()
        # varre até fechar a div da subseção
        prof, i = 0, ini
        for t in re.finditer(r'<(/?)div\b[^>]*>', corpo[ini:]):
            prof += -1 if t.group(1) else 1
            if prof == 0:
                i = ini + t.end()
                break
        bloco = corpo[ini:i]
        h3 = re.search(r'<h3[^>]*>(.*?)</h3>', bloco, re.S)
        if corpo[pos:ini]:
            pedacos.append({'tipo': 'bruto', 'html': corpo[pos:ini]})
        pedacos.append({
            'tipo': 'subsecao',
            'id': m.group(1),
            'nome': re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h3.group(1))).strip() if h3 else '',
            'html': bloco,
        })
        pos = i
    if corpo[pos:]:
        pedacos.append({'tipo': 'bruto', 'html': corpo[pos:]})
    return pedacos


def main():
    html = desfaz_build(open(PAGINA, encoding='utf-8', newline='').read())
    categorias, template, fim = [], '', 0

    for m in RE_SECAO.finditer(html):
        cat_classe, cat_id, corpo, indent = m.groups()
        cab = RE_CABECA.match(corpo)
        if not cab:
            raise SystemExit(f'categoria {cat_id}: category-header fora do padrão')
        categorias.append({
            'id': cat_id,
            'classe': cat_classe,
            'icone': cab.group(2).strip(),
            'nome': re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', cab.group(3))).strip(),
            'conteudo': fatia_subsecoes(corpo[cab.end():]),
        })
        template += html[fim:m.start()] + (
            f'<section class="category-section cat-{cat_classe}" id="{cat_id}">'
            f'{cab.group(1)}{{{{CAT_{cat_id}}}}}\n{indent}</section>')
        fim = m.end()
    template += html[fim:]

    os.makedirs(os.path.dirname(JSON_OUT), exist_ok=True)
    json.dump({'categorias': categorias}, open(JSON_OUT, 'w', encoding='utf-8', newline=''),
              ensure_ascii=False, indent=2)
    open(TPL, 'w', encoding='utf-8', newline='').write(template)

    n_sub = sum(sum(1 for p in c['conteudo'] if p['tipo'] == 'subsecao') for c in categorias)
    print(f'sistema: {len(categorias)} categorias, {n_sub} subseções -> data/sistema.json')
    print(f'         template: {len(template)} bytes (era {len(html)})')


if __name__ == '__main__':
    main()
