#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso de Origens (Rota 1): data/origens.json -> pages/origens.html
# Fonte da verdade = data/origens.json. NÃO editar pages/origens.html à mão.
# As 17 origem-card externalizadas como {opentag, corpo}; scaffold no template ({{CARD_n}}).
# Uso: python gerar_origens.py [repo_root]
import json, sys

REPO = sys.argv[1] if len(sys.argv) > 1 else '.'

def main():
    tpl = open(f'{REPO}/templates/origens.template.html', encoding='utf-8').read()
    data = json.load(open(f'{REPO}/data/origens.json', encoding='utf-8'))
    page = tpl
    for i, c in enumerate(data['cards']):
        page = page.replace(f'{{{{CARD_{i}}}}}', f'{c["opentag"]}{c["corpo"]}</{c["tag"]}>')
    open(f'{REPO}/pages/origens.html', 'w', encoding='utf-8').write(page)
    print(f'origens.html gerado: {len(data["cards"])} origens')

if __name__ == '__main__':
    main()
