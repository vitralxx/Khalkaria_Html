#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso de Raças (Rota 1): data/racas*.json -> pages/racas*.html
# Fonte da verdade = data/racas.json + data/racas/<r>.json. NÃO editar HTML à mão.
# Cards de conteúdo (trait/variant/tech/subspecie/rule/warning e os previews raca-card)
# externalizados como {opentag, corpo}; scaffold/prosa (content-card, stat-box) e o
# índice ficam no template com placeholders {{CARD_n}}.
# Uso: python gerar_racas.py [repo_root]
import json, sys

REPO = sys.argv[1] if len(sys.argv) > 1 else '.'
PAGES = ['racas'] + [f'racas/{r}' for r in
         ['humano', 'anao', 'dryad', 'gruto', 'corrompido', 'automato', 'inseto']]

def gen(page_rel):
    tpl = open(f'{REPO}/templates/{page_rel}.template.html', encoding='utf-8').read()
    data = json.load(open(f'{REPO}/data/{page_rel}.json', encoding='utf-8'))
    page = tpl
    for i, c in enumerate(data['cards']):
        page = page.replace(f'{{{{CARD_{i}}}}}', f'{c["opentag"]}{c["corpo"]}</{c["tag"]}>')
    open(f'{REPO}/pages/{page_rel}.html', 'w', encoding='utf-8').write(page)
    return len(data['cards'])

def main():
    for p in PAGES:
        print(f'{p}.html gerado: {gen(p)} cards')

if __name__ == '__main__':
    main()
