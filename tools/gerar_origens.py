#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso de Origens (Rota 1): data/origens.json -> pages/origens.html
# Fonte da verdade = data/origens.json. NÃO editar pages/origens.html à mão.
# As 17 origem-card externalizadas como {opentag, corpo}; scaffold no template ({{CARD_n}}).
# Uso: python gerar_origens.py [repo_root]
import html, json, re, sys, os
from kf_marca import abre, controles
from blocos import preenche

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1] if len(sys.argv) > 1 else RAIZ

# Os itens iniciais apontam para o Bazar como "bazar.html?item=Nome", que o Bazar
# não lê (ele abre só "#item/<id>"). O dado fica como veio; o link é resolvido aqui,
# pelo nome (ou nome antigo) do data/bazar.json. Nome sem item fica como está
# (pendente com o Pedro: "Garrafa de Rum Forte" não existe no Bazar).
RE_ITEM = re.compile(r'bazar\.html\?item=([^"#]+)"')

def ids_do_bazar():
    try:
        itens = json.load(open(f'{REPO}/data/bazar.json', encoding='utf-8'))
    except (OSError, ValueError):
        return {}
    por_nome = {}
    for it in itens:
        por_nome[it['nome']] = it['id']
        for antigo in it.get('nomesAntigos') or []:
            por_nome.setdefault(antigo, it['id'])
    return por_nome

def liga_bazar(corpo, por_nome):
    def troca(m):
        iid = por_nome.get(html.unescape(m.group(1)))
        return f'bazar.html#item/{iid}"' if iid else m.group(0)
    return RE_ITEM.sub(troca, corpo)

def main():
    tpl = open(f'{REPO}/templates/origens.template.html', encoding='utf-8').read()
    data = json.load(open(f'{REPO}/data/origens.json', encoding='utf-8'))
    por_nome = ids_do_bazar()
    page = tpl
    for i, c in enumerate(data['cards']):
        corpo = preenche(c['corpo'], 'origem', c['origem'], c['id'])   # F1b: bloco `origem`
        corpo = liga_bazar(corpo, por_nome)
        page = page.replace(f'{{{{CARD_{i}}}}}', f'{abre(c["opentag"], "origem", c["id"])}'
                                                 f'{controles(c["nome"])}{corpo}</{c["tag"]}>')
    open(f'{REPO}/pages/origens.html', 'w', encoding='utf-8').write(page)
    print(f'origens.html gerado: {len(data["cards"])} origens')

if __name__ == '__main__':
    main()
