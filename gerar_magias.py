#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso de Magias (Rota 1): data/magias.json -> pages/magias.html
# Fonte da verdade = data/magias.json. NÃO editar pages/magias.html à mão.
# Uso: python gerar_magias.py [repo_root]
# Template: templates/magias.template.html (contém <style>, sidebar e as 4 seções
# introdutórias como literal; placeholders {{NIVEL_1..4}} recebem as magias do JSON).
# Round-trip contra o HTML original validado no bootstrap (80/80 cards, página inteira
# normalizada idêntica) — ver método §6 do CLAUDE.md.
import json, sys, os

REPO = sys.argv[1] if len(sys.argv) > 1 else '.'
TPL = f'{REPO}/templates/magias.template.html'
JSON_SRC = f'{REPO}/data/magias.json'
OUT = f'{REPO}/pages/magias.html'

ESCOLAS = ('destruicao', 'abjuracao', 'alteracao', 'conhecimento')
LABELS = {
    'destruicao':   '⚔️ Destruição',
    'abjuracao':    '🛡️ Abjuração',
    'alteracao':    '🌀 Alteração',
    'conhecimento': '🔮 Conhecimento',
}

def gen_card(s):
    tag = '<span class="tradeoff-tag">⚠️ TRADE-OFF</span>' if s.get('tradeoff') else ''
    rows = ''.join(
        f'<tr><td>{st["caracteristica"]}</td><td>{st["valor"]}</td>'
        f'<td class="mod-{"yes" if st["mod"] else "no"}">{"✅" if st["mod"] else "❎"}</td></tr>'
        for st in s['stats'])
    return (f'<div class="spell-card"><div class="spell-header" onclick="toggleSpell(this)">'
            f'<span class="spell-dot"></span><h4>🔹 {s["nome"]}</h4>'
            f'<span class="spell-toggle">▶</span></div><div class="spell-body">{tag}'
            f'<table class="spell-table"><thead><tr><th>Característica</th><th>Valor</th>'
            f'<th>Mod</th></tr></thead><tbody>{rows}</tbody></table>'
            f'<p class="spell-desc">{s["descricao"]}</p></div></div>')

def gen_group(esc, spells):
    cards = '\n                    '.join(gen_card(s) for s in spells)
    return (f'<div class="school-group">\n'
            f'                <div class="school-header {esc}" onclick="toggleSchool(this)">{LABELS[esc]}'
            f'<span class="toggle-icon">▼</span></div>\n'
            f'                <div class="school-body">\n'
            f'                    {cards}\n'
            f'                </div>\n'
            f'            </div>')

def gen_level(data, n):
    d = data[f'nivel{n}']
    return '\n            '.join(gen_group(e, d[e]) for e in ESCOLAS)

def main():
    template = open(TPL, encoding='utf-8').read()
    data = json.load(open(JSON_SRC, encoding='utf-8'))
    page = template
    total = 0
    for n in range(1, 5):
        marker = f'{{{{NIVEL_{n}}}}}'
        if marker not in page:
            raise SystemExit(f'placeholder {marker} ausente no template')
        page = page.replace(marker, gen_level(data, n))
        total += sum(len(data[f'nivel{n}'][e]) for e in ESCOLAS)
    open(OUT, 'w', encoding='utf-8').write(page)
    print(f'magias.html gerado: {total} magias -> {OUT}')

if __name__ == '__main__':
    main()
