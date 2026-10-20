#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Gerador reverso de Raças (Rota 1): data/racas*.json -> pages/racas*.html
# Fonte da verdade = data/racas.json + data/racas/<r>.json. NÃO editar HTML à mão.
# Cards de conteúdo (trait/variant/tech/subspecie/rule/warning e os previews raca-card)
# externalizados como {opentag, corpo}; scaffold/prosa (content-card, stat-box) e o
# índice ficam no template com placeholders {{CARD_n}}.
# F4.6f: as linhas da tabela de corrupção (raca.corrupcao.poderes/adversidades)
# são entidade `corrupcao`: o <tr> ganha os data-kf-* e a 1ª célula, os controles
# hidden (um botão não pode ser filho direto de <tr>). Nada mais muda na linha.
# Uso: python gerar_racas.py [repo_root]
import json, re, sys, os
from kf_marca import TIPO_POR_CLASSE_CSS_RACA, abre, atributos, controles, tipo_do_opentag
from blocos import preenche

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1] if len(sys.argv) > 1 else RAIZ
PAGES = ['racas'] + [f'racas/{r}' for r in
         ['humano', 'anao', 'dryad', 'gruto', 'corrompido', 'automato', 'inseto']]

RE_TABELA_CORR = re.compile(r'<table class="corr-table">.*?</table>', re.S)
RE_LINHA_CORR = re.compile(r'<tr><td>(.*?)</td>')


def marca_corrupcao(page, raca, onde):
    """Marca as linhas da tabela de corrupção, na ordem do bloco (poderes e depois
    adversidades). O nome da 1ª célula tem de ser o do item: senão derruba."""
    corr = raca.get('corrupcao')
    if not corr:
        return page
    itens = [it for g in ('poderes', 'adversidades') for it in corr[g]['itens']]
    fila = iter(itens)
    feitos = []

    def linha(m):
        it = next(fila, None)
        if it is None or m.group(1) != it['nome']:
            raise SystemExit(f'gerar_racas: {onde}: linha de corrupção {m.group(1)!r} fora da ordem do bloco '
                             f'(esperado {it["nome"] if it else "nenhuma"!r})')
        feitos.append(it['id'])
        return f'<tr{atributos("corrupcao", it["id"])}><td>{controles(it["nome"])}{m.group(1)}</td>'
    page = RE_TABELA_CORR.sub(lambda t: RE_LINHA_CORR.sub(linha, t.group(0)), page)
    if len(feitos) != len(itens):
        raise SystemExit(f'gerar_racas: {onde}: {len(feitos)} linhas de corrupção marcadas para {len(itens)} itens no bloco')
    return page


def gen(page_rel):
    tpl = open(f'{REPO}/templates/{page_rel}.template.html', encoding='utf-8').read()
    data = json.load(open(f'{REPO}/data/{page_rel}.json', encoding='utf-8'))
    # F1b: a página de cada raça lê o bloco `raca` (o índice não tem bloco)
    page = preenche(tpl, 'raca', data['raca'], page_rel) if 'raca' in data else tpl
    if 'raca' in data:
        page = marca_corrupcao(page, data['raca'], page_rel)
    for i, c in enumerate(data['cards']):
        tipo = tipo_do_opentag(c['opentag'], TIPO_POR_CLASSE_CSS_RACA)
        if tipo is None:            # rule-box/warning: regra da página, não entidade
            card = f'{c["opentag"]}{c["corpo"]}</{c["tag"]}>'
        elif c['tag'] == 'a':       # preview do índice é um <a>: botão dentro de link
            card = f'{abre(c["opentag"], tipo, c["id"])}{c["corpo"]}</a>'   # é HTML inválido
        else:
            card = (f'{abre(c["opentag"], tipo, c["id"])}{controles(c["nome"])}'
                    f'{c["corpo"]}</{c["tag"]}>')
        page = page.replace(f'{{{{CARD_{i}}}}}', card)
    open(f'{REPO}/pages/{page_rel}.html', 'w', encoding='utf-8').write(page)
    return len(data['cards'])

def main():
    for p in PAGES:
        print(f'{p}.html gerado: {gen(p)} cards')

if __name__ == '__main__':
    main()
