#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso do Limiar (Rota 1): data/limiar.json -> pages/limiar.html
# Fonte da verdade = data/limiar.json. NÃO editar pages/limiar.html à mão.
# Template: templates/limiar.template.html — placeholders {{CAT_<id>}} (7 seções de
# catálogo) e {{DORES}}/{{BENEFICIOS}} (O Abismo).
# Uso: python gerar_limiar.py [repo_root]
import json, sys

REPO = sys.argv[1] if len(sys.argv) > 1 else '.'
TPL = f'{REPO}/templates/limiar.template.html'
JSON_SRC = f'{REPO}/data/limiar.json'
OUT = f'{REPO}/pages/limiar.html'

def gen_catalog_card(c, cat):
    lines = [f'        <div class="catalog-card cat-{cat}">']
    for k in c['ordem']:
        v = c['nome'] if k == 'name' else c[k]
        lines.append(f'            <div class="catalog-card-{k}">{v}</div>')
    lines.append('        </div>')
    return '\n'.join(lines)

def gen_catalog(cat):
    return '\n'.join(gen_catalog_card(c, cat['id']) for c in cat['cards'])

def gen_abismo_card(c, cls):
    icon_cls = 'dor-icon beneficio-icon' if cls == 'beneficio-abismo-card' else 'dor-icon'
    attrs = (' ' + c['tituloAttrs']) if c.get('tituloAttrs') else ''
    ca = (' ' + c['cardAttrs']) if c.get('cardAttrs') else ''
    ia = (' ' + c['iconAttrs']) if c.get('iconAttrs') else ''
    return (f'<div class="{cls}"{ca}>\n'
            f'                        <div class="dor-card-header">\n'
            f'                            <div class="{icon_cls}"{ia}>{c["iconeSvg"]}</div>\n'
            f'                            <div class="dor-card-info">\n'
            f'                                <h4 class="dor-card-title"{attrs}>{c["nome"]}</h4>\n'
            f'                                <span class="dor-card-cost {c["tipo"]}">{c["custo"]}</span>\n'
            f'                            </div>\n'
            f'                        </div>\n'
            f'                        <p class="dor-card-desc">{c["desc"]}</p>\n'
            f'                    </div>')

def gen_abismo(cards, cls):
    return '\n                    \n                    '.join(gen_abismo_card(c, cls) for c in cards)

def main():
    template = open(TPL, encoding='utf-8').read()
    data = json.load(open(JSON_SRC, encoding='utf-8'))
    page = template
    for cat in data['catalogo']:
        page = page.replace(f'{{{{CAT_{cat["id"]}}}}}', gen_catalog(cat))
    page = page.replace('{{DORES}}', gen_abismo(data['abismo']['dores'], 'dor-card'))
    page = page.replace('{{BENEFICIOS}}', gen_abismo(data['abismo']['beneficios'], 'beneficio-abismo-card'))
    total = sum(len(c['cards']) for c in data['catalogo']) + \
        len(data['abismo']['dores']) + len(data['abismo']['beneficios'])
    open(OUT, 'w', encoding='utf-8').write(page)
    print(f'limiar.html gerado: {total} cartas -> {OUT}')

if __name__ == '__main__':
    main()
