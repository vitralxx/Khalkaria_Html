#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso das Classes (Rota 1): data/classes/<c>.json -> pages/classes/<c>.html
# Fonte da verdade = data/classes/<c>.json. NÃO editar o HTML à mão.
# Cada card de conteúdo (technique/tech/tier-technique/marca/ultimate/companion/...)
# foi externalizado como {tipo, nome, corpo}; o template guarda todo o scaffold
# (hero, stat/formula/progression, ramo/tier headers) com placeholders {{CARD_n}}.
# Uso: python gerar_classes.py [repo_root] [classe]  (sem classe = todas)
import json, sys

REPO = sys.argv[1] if len(sys.argv) > 1 else '.'
ONE = sys.argv[2] if len(sys.argv) > 2 else None
CLASSES = [ONE] if ONE else ['espadachim', 'monge', 'batedor', 'alquimista',
                             'teurgo', 'artilheiro', 'brutalista']

def gen_one(name):
    tpl = open(f'{REPO}/templates/classes/{name}.template.html', encoding='utf-8').read()
    data = json.load(open(f'{REPO}/data/classes/{name}.json', encoding='utf-8'))
    page = tpl
    for i, c in enumerate(data['cards']):
        page = page.replace(f'{{{{CARD_{i}}}}}', f'<div class="{c["tipo"]}">{c["corpo"]}</div>')
    open(f'{REPO}/pages/classes/{name}.html', 'w', encoding='utf-8').write(page)
    return len(data['cards'])

def main():
    for name in CLASSES:
        n = gen_one(name)
        print(f'{name}.html gerado: {n} cards')

if __name__ == '__main__':
    main()
