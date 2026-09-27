# -*- coding: utf-8 -*-
"""Regras de página em data/*.json (Rota 1), compartilhado pelos geradores.

O texto canônico que fica fora dos cards (regra geral de uma página, intro de
seção) mora na chave `regras` do JSON da página, {chave: HTML verbatim do
Notion}. O template guarda só a estrutura (o rule-box, o <p> e o estilo) com o
marcador {{REGRA_<chave>}} no lugar do texto; o gerador troca pelo valor.

Marcador sem chave, chave sem marcador ou valor que não é texto derrubam o
gerador: o texto não fica órfão no JSON nem literal no template.
"""
import re

RE_REGRA = re.compile(r'\{\{REGRA_([A-Za-z0-9]+)\}\}')


def preenche(page, regras, onde):
    usadas = set()

    def troca(m):
        k = m.group(1)
        if k not in regras:
            raise SystemExit(f'{onde}: {m.group(0)} sem campo em "regras" do JSON')
        if not isinstance(regras[k], str):
            raise SystemExit(f'{onde}: regras.{k} não é texto ({type(regras[k]).__name__})')
        usadas.add(k)
        return regras[k]

    page = RE_REGRA.sub(troca, page)
    sobra = sorted(set(regras) - usadas)
    if sobra:
        raise SystemExit(f'{onde}: regras sem marcador {{{{REGRA_…}}}} no template: {sobra}')
    return page
