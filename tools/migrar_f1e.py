#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Migração F1e(c) (uma vez só): o que ainda era literal nos templates de classe
vai para o bloco `classe`, verbatim, pelo extrator do tools/migrar_f1b.py
(casar exatamente N vezes, trecho casado -> JSON, template -> marcador):

  * classe.ramosTexto[]: cada <p> do parágrafo dos ramos ("Os ramos são
    caminhos…", com a regra "3 Marcas e 6 Técnicas de Ramo (3 no Tier 1, …)");
  * classe.tiers[] {titulo?, badge}: os cabeçalhos de tier ("Tier 3 — Ultimates"
    / "Nível 5 • 1x/Dia"; no Espadachim só o selo "TIER N", repetido nos 3 ramos,
    que vira UM campo por tier com o marcador repetido).

Os derivados (classe.ramosRegra, classe.tiers[].tier/nivel/usos e o
grupo/ramo/tier/custoTexto de cada card) saem do tools/blocos.py, que esta
migração chama no fim (python tools/blocos.py faz o mesmo depois).

Antes de gravar, confere que o template novo, preenchido com o bloco novo, é
byte a byte o template antigo preenchido com o bloco antigo. Já migrado
(template com {{classe.tiers.…}}), recusa-se a rodar: fica como registro.

Uso: python tools/migrar_f1e.py [repo_root]
"""
import copy, json, os, re, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS)
import blocos                                   # noqa: E402
from blocos import preenche, poe, CLASSES       # noqa: E402
from migrar_f1b import Ex, ordena               # noqa: E402

RAIZ = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(TOOLS)


def ramos_texto(ex, nome):
    if nome == 'espadachim':
        # <p style=…>\n   Os ramos são … ramos.\n   </p> (o espaço em volta fica no template)
        ex.lista('ramosTexto', r'<p style="color: var\(--text-muted\); margin-bottom: 1rem;">\s*'
                               r'(Os ramos são caminhos.*?)\s*</p>', None, 1)
        return
    r = ex.regiao(r'<div class="ramos-intro">(?:(?!</div>).)*?Os ramos são.*?</div>')
    n = len(re.findall(r'<p\b', ex.t[r[0]:r[1]]))
    ex.lista('ramosTexto', r'<p(?: style="[^"]*")?>(.*?)</p>', r, n)


def tiers(ex, nome):
    heads = ex._casa(r'<div class="tier-header">.*?</div>', None, 9 if nome == 'espadachim' else 3)
    vistos = {}
    for m in heads:
        rg = (m.start(), m.end())
        if nome == 'espadachim':
            b = ex._casa(r'<span class="tier-badge">(TIER (\d))</span>', rg)[0]
            k = int(b.group(2)) - 1
            if vistos.setdefault(k, b.group(1)) != b.group(1):
                raise SystemExit(f'{nome}: tier {k + 1} com selos diferentes')
            ex.marca(f'tiers.{k}.badge', b.start(1), b.end(1))
        else:
            h = ex._casa(r'<h3>(Tier (\d)[^<]*)</h3>', rg)[0]
            k = int(h.group(2)) - 1
            ex.marca(f'tiers.{k}.titulo', h.start(1), h.end(1))
            ex.um(f'tiers.{k}.badge', r'<span class="tier-badge">(.*?)</span>', rg)
    if sorted(vistos or range(3)) != [0, 1, 2]:
        raise SystemExit(f'{nome}: tiers {sorted(vistos)} (esperado 1, 2 e 3)')


def migra_classe(nome):
    ft = os.path.join(RAIZ, 'templates', 'classes', f'{nome}.template.html')
    fj = os.path.join(RAIZ, 'data', 'classes', f'{nome}.json')
    velho = open(ft, encoding='utf-8').read()
    doc = json.load(open(fj, encoding='utf-8'))
    antes = preenche(velho, 'classe', doc['classe'], nome)
    ex = Ex(velho, nome)
    ramos_texto(ex, nome)
    tiers(ex, nome)
    subs = sorted(set(ex.subs))
    for (a, z, c1), (a2, _, c2) in zip(subs, subs[1:]):
        if z > a2:
            raise SystemExit(f'{nome}: {c1} e {c2} se sobrepõem')
    novo = velho
    for a, z, cam in reversed(subs):
        novo = novo[:a] + '{{classe.' + cam + '}}' + novo[z:]
    b = copy.deepcopy(doc['classe'])
    b['ramosTexto'] = ex.b['ramosTexto']
    b['tiers'] = ex.b['tiers']
    for cam, v in blocos.deriva_classe(nome, b, doc['cards'], novo):
        poe(b, cam, v)
    if preenche(novo, 'classe', b, nome) != antes:
        raise SystemExit(f'{nome}: round-trip falhou')
    ordem = list(doc['classe'])
    i = ordem.index('ramos') + 1
    doc['classe'] = ordena(b, ordem[:i] + ['ramosTexto', 'ramosRegra', 'tiers'] + ordem[i:])
    return ft, novo, fj, doc, len(subs)


def main():
    for c in CLASSES:
        if '{{classe.tiers.' in open(os.path.join(RAIZ, 'templates', 'classes', f'{c}.template.html'),
                                     encoding='utf-8').read():
            raise SystemExit('migrar_f1e: já migrado. Edite data/ e rode build.py.')
    saidas = []
    for c in CLASSES:
        ft, novo, fj, doc, n = migra_classe(c)
        saidas.append((ft, novo, fj, doc))
        print(f'classe {c}: {n} marcadores')
    for ft, novo, fj, doc in saidas:
        with open(ft, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(novo)
        blocos._grava(fj, doc)
    print(f'derivados: {blocos.regrava(RAIZ)} arquivos regravados')


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    main()
