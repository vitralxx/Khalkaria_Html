#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Migração F1b, correção da revisão (uma vez só): o que ainda era conteúdo
mecânico literal nos templates de classe vai para o bloco `classe`, verbatim,
pelo mesmo extrator do tools/migrar_f1b.py (casar exatamente N vezes, trecho
casado -> JSON, template -> marcador):

  * classe.progressao {colunas, linhas}: a tabela "Progressão" (as 7 classes;
    o Espadachim tem 4 colunas, as outras 2);
  * classe.tecnicas {regra, quantidade}: "Toda classe possui técnicas, …" e
    "Você possui 3 Técnicas + Nível.";
  * classe.requisitosDeCard[] {texto}: o requisito solto antes de um card
    (Batedor, Senhor das Linhas); o `card` é derivado (tools/blocos.py).

E normaliza os status dos blocos para o vocabulário do plano (§3.2):
recurso do Espadachim/Teurgo -> `pedroDecide`; técnica de raça -> `pendente`
com a `pergunta` de tools/pendentes_balanceamento.json.

Antes de gravar, confere que o template novo, preenchido com o bloco novo, é
byte a byte o template antigo preenchido com o bloco antigo. Já migrado
(template com {{classe.progressao.…}}), recusa-se a rodar: fica como registro.

Uso: python tools/migrar_f1b_correcao.py [repo_root]
"""
import copy, json, os, sys

TOOLS = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, TOOLS)
import blocos                                   # noqa: E402
from blocos import preenche, CLASSES, RACAS     # noqa: E402
from migrar_f1b import Ex, ordena, ORDEM_CLASSE  # noqa: E402

RAIZ = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(TOOLS)
ORDEM = ORDEM_CLASSE[:ORDEM_CLASSE.index('recurso')] + ['progressao', 'tecnicas'] + \
    ORDEM_CLASSE[ORDEM_CLASSE.index('recurso'):] + ['requisitosDeCard']
NOTA_TECNICA = ('Pedro (03-respostas-pedro.md §2): a raça dá "1 técnica de raça". A página não '
                'distingue qual característica é a técnica: pergunta ao balanceamento, não inventar.')


def progressao(ex, nome):
    r = ex.regiao(r'<table class="progression-table">.*?</table>')
    ex.lista('progressao.colunas', r'<th>(.*?)</th>', r, 4 if nome == 'espadachim' else 2)
    if nome == 'espadachim':
        linhas = ex._casa(r'<tr>\s*<td class="level">.*?</tr>', r, 5)
        for i, m in enumerate(linhas):
            cel = ex._casa(r'<td(?: class="level")?>(.*?)</td>', (m.start(), m.end()), 4)
            for j, c in enumerate(cel):
                ex.marca(f'progressao.linhas.{i}.{j}', c.start(1), c.end(1))
    else:
        linhas = ex._casa(r'<tr>\s*<td><span class="level-badge">.*?</tr>', r, 5)
        for i, m in enumerate(linhas):
            rl = (m.start(), m.end())
            ex.um(f'progressao.linhas.{i}.0', r'<span class="level-badge">(.*?)</span>', rl)
            ex.um(f'progressao.linhas.{i}.1', r'</span></td>\s*<td>(.*?)</td>', rl)


def tecnicas(ex):
    m = ex._casa(r'(Toda classe possui técnicas, [^<]*?) <strong>(Você possui [^<]*?)</strong>')[0]
    ex.marca('tecnicas.regra', m.start(1), m.end(1))
    ex.marca('tecnicas.quantidade', m.start(2), m.end(2))


def requisitos(ex, nome):
    if nome == 'batedor':
        ex.lista('requisitosDeCard', r'<p style="color: var\(--text-muted\); font-style: italic; '
                                     r'margin: 0\.5rem 0;">(?P<texto>Requisito: .*?)</p>', None, 1)
    else:
        ex._casa(r'>Requisito: ', None, 0)


def migra_classe(nome):
    ft = os.path.join(RAIZ, 'templates', 'classes', f'{nome}.template.html')
    fj = os.path.join(RAIZ, 'data', 'classes', f'{nome}.json')
    velho = open(ft, encoding='utf-8').read()
    doc = json.load(open(fj, encoding='utf-8'))
    antes = preenche(velho, 'classe', doc['classe'], nome)
    ex = Ex(velho, nome)
    progressao(ex, nome)
    tecnicas(ex)
    requisitos(ex, nome)
    subs = sorted(ex.subs)
    for (a, z, c1), (a2, _, c2) in zip(subs, subs[1:]):
        if z > a2:
            raise SystemExit(f'{nome}: {c1} e {c2} se sobrepõem')
    novo = velho
    for a, z, cam in reversed(subs):
        novo = novo[:a] + '{{classe.' + cam + '}}' + novo[z:]
    b = copy.deepcopy(doc['classe'])
    for k in ('progressao', 'tecnicas', 'requisitosDeCard'):
        if k in ex.b:
            b[k] = ex.b[k]
    rec = b.get('recurso') or {}
    if rec.get('status') == 'PENDENTE PEDRO':
        rec['status'] = 'pedroDecide'
    for cam, v in blocos.deriva_classe(nome, b, doc['cards'], novo):
        blocos.poe(b, cam, v)
    if preenche(novo, 'classe', b, nome) != antes:
        raise SystemExit(f'{nome}: round-trip falhou')
    doc['classe'] = ordena(b, ORDEM)
    return ft, novo, fj, doc, len(ex.subs)


def migra_raca(nome):
    fj = os.path.join(RAIZ, 'data', 'racas', f'{nome}.json')
    doc = json.load(open(fj, encoding='utf-8'))
    t = doc['raca']['tecnica']
    if t != {'id': None, 'status': 'PENDENTE', 'nota': NOTA_TECNICA}:
        raise SystemExit(f'{nome}: técnica de raça fora do formato esperado: {t}')
    doc['raca']['tecnica'] = {'id': None, 'status': 'pendente', 'pergunta': 'tecnica-de-raca', 'nota': NOTA_TECNICA}
    return fj, doc


def main():
    for c in CLASSES:
        if '{{classe.progressao.' in open(os.path.join(RAIZ, 'templates', 'classes', f'{c}.template.html'),
                                          encoding='utf-8').read():
            raise SystemExit('migrar_f1b_correcao: já migrado. Edite data/ e rode build.py.')
    saidas = []
    for c in CLASSES:
        ft, novo, fj, doc, n = migra_classe(c)
        saidas.append((ft, novo, fj, doc))
        print(f'classe {c}: {n} campos')
    racas = [migra_raca(r) for r in RACAS]
    for ft, novo, fj, doc in saidas:
        with open(ft, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(novo)
        blocos._grava(fj, doc)
    for fj, doc in racas:
        blocos._grava(fj, doc)
    print(f'raças: {len(racas)} técnicas normalizadas')


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(errors='replace')
    except (AttributeError, ValueError):
        pass
    main()
