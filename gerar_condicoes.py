#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso de Condições (Rota 1): data/condicoes.json -> pages/condicoes.html
# Fonte da verdade = data/condicoes.json. NÃO editar pages/condicoes.html à mão.
# Template: templates/condicoes.template.html (placeholders {{CAT_<id>}} por categoria).
# Uso: python gerar_condicoes.py [repo_root]
import json, sys

REPO = sys.argv[1] if len(sys.argv) > 1 else '.'
TPL = f'{REPO}/templates/condicoes.template.html'
JSON_SRC = f'{REPO}/data/condicoes.json'
OUT = f'{REPO}/pages/condicoes.html'

def gen_card(cd):
    return (f'<div class="condicao-card" id="{cd["id"]}">\n'
            f'                        <h4>{cd["nome"]}</h4>\n'
            f'                        {cd["corpo"]}\n'
            f'                    </div>')

def gen_cat(cat):
    return '\n                    \n                    '.join(gen_card(cd) for cd in cat['cards'])

def main():
    template = open(TPL, encoding='utf-8').read()
    data = json.load(open(JSON_SRC, encoding='utf-8'))
    page = template
    total = 0
    for cat in data['categorias']:
        ph = f'{{{{CAT_{cat["id"]}}}}}'
        if ph not in page:
            raise SystemExit(f'placeholder {ph} ausente no template')
        page = page.replace(ph, gen_cat(cat))
        total += len(cat['cards'])
    open(OUT, 'w', encoding='utf-8').write(page)
    print(f'condicoes.html gerado: {total} condições -> {OUT}')

if __name__ == '__main__':
    main()
