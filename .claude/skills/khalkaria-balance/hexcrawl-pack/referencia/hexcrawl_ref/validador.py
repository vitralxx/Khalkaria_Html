"""Conferências do mundo (docs/03-dados.md §5). FALHA impede salvar/publicar; AVISO só informa.

Uso: python -m hexcrawl_ref.validador <pasta-do-mundo>
"""
from __future__ import annotations

import json
import os
import sys
from collections import Counter

from . import hexmath as hm
from .regras import FAIXAS_CONSEQUENCIA

CATEGORIAS = ('extracao', 'combate', 'interacao', 'comerciante', 'abrigo', 'ruina', 'assentamento', 'covil', 'achado')
RARIDADES = ('comum', 'notavel', 'raro')
POLARIDADES = ('favoravel', 'neutro', 'adverso')


def carregar(pasta: str) -> dict:
    def j(*p):
        return json.load(open(os.path.join(pasta, *p), encoding='utf-8'))
    m = {'mundo': j('mundo.json'), 'hexes': j('hexes.json'), 'arestas': j('arestas.json'),
         'rios': j('rios.json'), 'vias': j('vias.json'), 'territorios': j('territorios.json'),
         'eventos': {}, 'consequencias': {}, 'camadas': {}}
    for sub in ('eventos', 'consequencias'):
        d = os.path.join(pasta, sub)
        if os.path.isdir(d):
            for f in sorted(os.listdir(d)):
                if f.endswith('.json'):
                    doc = j(sub, f)
                    m[sub][doc['regiao']] = doc
    d = os.path.join(pasta, 'camadas')
    if os.path.isdir(d):
        for f in sorted(os.listdir(d)):
            if f.endswith('.json'):
                doc = j('camadas', f)
                m['camadas'][doc.get('camada')] = doc
    return m


def validar(m: dict) -> tuple[list[str], list[str], dict]:
    falhas, avisos = [], []
    g = m['mundo']['grade']
    C, L = g['colunas'], g['linhas']
    tipos = {t['id']: t for t in m['mundo']['tipos']}
    regioes = {r['id']: r for r in m['mundo']['regioes']}
    cidades = {c['id']: c for c in m['mundo'].get('cidades', [])}
    for r in regioes.values():
        alt = r.get('alternativaDe')
        if alt is not None and (alt not in regioes or regioes[alt].get('alternativaDe') is not None):
            falhas.append(f'[regiao] {r["id"]}: alternativaDe {alt!r} tem de ser uma região da base')
    for t in tipos.values():
        if t.get('soEmbarcacao') and t.get('custo') is not None:
            avisos.append(f'[tipo] {t["id"]}: o custo vem da embarcação; o custo do tipo é ignorado')
    ids_barco = Counter(b['id'] for b in m['mundo'].get('embarcacoes', []))
    for b, n in ids_barco.items():
        if n > 1:
            falhas.append(f'[embarcacao] id repetido {b}')
    hexes = {}
    for h in m['hexes']['hexes']:
        if h['id'] in hexes:
            falhas.append(f'[hex] id repetido {h["id"]}')
        hexes[h['id']] = h
    # 1. grade completa e campos
    esperados = {hm.id_de(c, l) for c in range(1, C + 1) for l in range(1, L + 1)}
    if set(hexes) != esperados:
        falhas.append(f'[hex] a grade {C}x{L} tem de ter um registro por célula: faltam '
                      f'{sorted(esperados - set(hexes))[:5]}, sobram {sorted(set(hexes) - esperados)[:5]}')
    for hid, h in hexes.items():
        if h['tipo'] not in tipos:
            falhas.append(f'[hex] {hid}: tipo {h["tipo"]!r} fora de mundo.tipos')
        if h.get('regiao') is not None and h['regiao'] not in regioes:
            falhas.append(f'[hex] {hid}: região {h["regiao"]!r} inexistente')
        elif h.get('regiao') is not None and regioes[h['regiao']].get('alternativaDe') is not None:
            falhas.append(f'[hex] {hid}: a região alternativa {h["regiao"]!r} só entra por camadas/')
        if h.get('cidade') is not None and h['cidade'] not in cidades:
            falhas.append(f'[hex] {hid}: cidade {h["cidade"]!r} inexistente')
        terra = h['tipo'] != 'agua'
        if terra and (h.get('regiao') is None) == (h.get('cidade') is None):
            falhas.append(f'[hex] {hid}: hex de terra precisa de região OU cidade (exatamente um)')
        if not terra and h.get('cidade') is not None:
            falhas.append(f'[hex] {hid}: água não pertence a cidade')
    # 2. vias
    via_cruza = {}   # chave de aresta -> via
    for v in m['vias']['vias']:
        hs = v['hexes']
        if v['tipo'] not in ('estrada', 'trilha'):
            falhas.append(f'[via] {v["id"]}: tipo {v["tipo"]!r}')
        if len(hs) < 2:
            falhas.append(f'[via] {v["id"]}: precisa de 2 hexes ou mais')
        for a, b in zip(hs, hs[1:]):
            if a not in hexes or b not in hexes:
                falhas.append(f'[via] {v["id"]}: hex fora da grade ({a}, {b})')
                continue
            d = hm.direcao_entre(a, b)
            if d is None:
                falhas.append(f'[via] {v["id"]}: {a} e {b} não são vizinhos')
                continue
            via_cruza[hm.chave_aresta(a, d)] = v['id']
        for ponta in (hs[0], hs[-1]):
            h = hexes.get(ponta, {})
            if not (h.get('especial') or h.get('cidade') or _na_fronteira(ponta, hexes, C, L)):
                avisos.append(f'[via] {v["id"]}: termina em {ponta}, que não é especial, cidade nem fronteira '
                              '(toda via deveria levar a um objetivo)')
    # 3. rios
    vertice_hex = {}   # vértice (pixel 1x) -> hexes que o tocam
    for hid in hexes:
        for v in hm.vertices_px(hid):
            vertice_hex.setdefault(v, set()).add(hid)
    aresta_de_rio = {}
    for r in m['rios']['rios']:
        ants = None
        for i, k in enumerate(r['arestas']):
            try:
                a, b = hm.hexes_da_aresta(k)
            except ValueError as e:
                falhas.append(f'[rio] {r["id"]}: {e}')
                continue
            if a not in hexes or b not in hexes:
                falhas.append(f'[rio] {r["id"]}: aresta {k} fora da grade')
                continue
            if k in aresta_de_rio:
                falhas.append(f'[rio] {r["id"]}: aresta {k} repetida (já é do rio {aresta_de_rio[k]})')
            aresta_de_rio[k] = r['id']
            ext = set(hm.extremos_aresta_px(*k.split(':')))
            if ants is not None and not (ants & ext):
                falhas.append(f'[rio] {r["id"]}: aresta {k} (nº {i + 1}) não encosta na anterior')
            ants = ext
        if r['arestas']:
            ult_ext = set(hm.extremos_aresta_px(*r['arestas'][-1].split(':')))
            if len(r['arestas']) > 1:   # a foz é a ponta que não encosta na aresta anterior
                ult_ext -= set(hm.extremos_aresta_px(*r['arestas'][-2].split(':')))
            toca_agua = any(hexes[x]['tipo'] == 'agua' for v in ult_ext for x in vertice_hex.get(v, ()))
            if not toca_agua:
                # confluência: o último vértice encosta em outro rio
                outros = [k for k, rid in aresta_de_rio.items() if rid != r['id']]
                if not any(ult_ext & set(hm.extremos_aresta_px(*k.split(':'))) for k in outros):
                    avisos.append(f'[rio] {r["id"]}: a foz não encosta em água nem em outro rio')
    # 4. arestas especiais
    vistas = Counter(a['aresta'] for a in m['arestas']['arestas'])
    for k, n in vistas.items():
        if n > 1:
            falhas.append(f'[aresta] {k} repetida')
    for a in m['arestas']['arestas']:
        k = a['aresta']
        try:
            x, y = hm.hexes_da_aresta(k)
        except ValueError as e:
            falhas.append(f'[aresta] {e}')
            continue
        if x not in hexes or y not in hexes:
            falhas.append(f'[aresta] {k} fora da grade')
            continue
        if a['tipo'] == 'ponte' and k not in aresta_de_rio:
            falhas.append(f'[aresta] ponte em {k}, que não é aresta de rio')
        if a['tipo'] == 'penhasco':
            if a.get('ladoAlto') not in (x, y):
                falhas.append(f'[aresta] penhasco {k}: ladoAlto tem de ser {x} ou {y}')
            if k in aresta_de_rio:
                falhas.append(f'[aresta] {k} é rio e penhasco ao mesmo tempo')
    pontes = {a['aresta'] for a in m['arestas']['arestas'] if a['tipo'] == 'ponte'}
    for k, vid in via_cruza.items():
        if k in aresta_de_rio and k not in pontes:
            avisos.append(f'[via] {vid} cruza o rio {aresta_de_rio[k]} em {k} sem ponte (vau proposital?)')
    # 5. territórios
    for t in m['territorios']['territorios']:
        for hid in t['hexes']:
            if hid not in hexes:
                falhas.append(f'[territorio] {t["id"]}: hex {hid} fora da grade')
    # 5b. camadas alternativas
    em_camada = {}   # id do hex -> {camada: registro}
    for cid, doc in m['camadas'].items():
        reg = regioes.get(cid)
        if reg is None or reg.get('alternativaDe') is None:
            falhas.append(f'[camada] {cid!r}: tem de ser uma região com alternativaDe')
            continue
        vistos_c = Counter(h['id'] for h in doc['hexes'])
        for hid, n in vistos_c.items():
            if n > 1:
                falhas.append(f'[camada] {cid}: hex {hid} repetido')
        for h in doc['hexes']:
            hid = h['id']
            if hid not in hexes:
                falhas.append(f'[camada] {cid}: hex {hid} fora da grade')
                continue
            if h['tipo'] not in tipos:
                falhas.append(f'[camada] {cid}: {hid} com tipo {h["tipo"]!r} fora de mundo.tipos')
            if h.get('regiao') != cid or h.get('cidade') is not None:
                falhas.append(f'[camada] {cid}: {hid} tem de ter regiao = {cid} e nenhuma cidade')
            if hexes[hid].get('regiao') != reg['alternativaDe']:
                avisos.append(f'[camada] {cid}: {hid} cobre um hex que não é de {reg["alternativaDe"]}')
            em_camada.setdefault(hid, {})[cid] = h
    # 6. eventos
    ids = Counter()
    for rid, doc in m['eventos'].items():
        if rid not in regioes:
            falhas.append(f'[evento] arquivo de região inexistente: {rid}')
        for e in doc['eventos']:
            ids[e['id']] += 1
            if e['categoria'] not in CATEGORIAS:
                falhas.append(f'[evento] {e["id"]}: categoria {e["categoria"]!r}')
            if e['raridade'] not in RARIDADES:
                falhas.append(f'[evento] {e["id"]}: raridade {e["raridade"]!r}')
            if e['polaridade'] not in POLARIDADES:
                falhas.append(f'[evento] {e["id"]}: polaridade {e["polaridade"]!r}')
            fora = [t for t in e['tipos'] if t not in tipos]
            if fora:
                falhas.append(f'[evento] {e["id"]}: tipos inexistentes {fora}')
    for i, n in ids.items():
        if n > 1:
            falhas.append(f'[evento] id repetido {i} (ids são únicos no mundo inteiro)')
    sem_tabela = Counter()
    for hid, h in hexes.items():
        if h.get('especial') or h.get('regiao') is None or h['tipo'] == 'agua':
            continue
        pool = m['eventos'].get(h['regiao'], {}).get('eventos', [])
        if not any(h['tipo'] in e['tipos'] for e in pool):
            sem_tabela[(h['regiao'], h['tipo'])] += 1
    for por_camada in em_camada.values():
        for cid, h in por_camada.items():
            if h.get('especial') or h['tipo'] == 'agua':
                continue
            pool = m['eventos'].get(cid, {}).get('eventos', [])
            if not any(h['tipo'] in e['tipos'] for e in pool):
                sem_tabela[(cid, h['tipo'])] += 1
    for (rid, t), n in sorted(sem_tabela.items()):
        avisos.append(f'[evento] {n} hex(es) de {t} em {rid} sem nenhum evento possível')
    # 7. consequências
    oficiais = [(de, ate) for de, ate, *_ in FAIXAS_CONSEQUENCIA]
    for rid, doc in m['consequencias'].items():
        faixas = [(f['de'], f['ate']) for f in doc['faixas']]
        if faixas != oficiais:
            falhas.append(f'[consequencia] {rid}: as faixas têm de ser {oficiais}')
    resumo = {'hexes': len(hexes),
              'porTipo': dict(Counter(h['tipo'] for h in hexes.values())),
              'porRegiao': dict(Counter(h.get('regiao') or h.get('cidade') or 'mar' for h in hexes.values())),
              'vias': len(m['vias']['vias']), 'rios': len(m['rios']['rios']),
              'camadas': {cid: len(doc['hexes']) for cid, doc in m['camadas'].items()},
              'eventos': sum(ids.values())}
    return falhas, avisos, resumo


def _na_fronteira(hid: str, hexes: dict, C: int, L: int) -> bool:
    r = hexes[hid].get('regiao')
    return any(hexes[v].get('regiao') != r for v in hm.vizinhos(hid, C, L).values())


if __name__ == '__main__':
    f, a, r = validar(carregar(sys.argv[1]))
    for x in f:
        print('FALHA', x)
    for x in a:
        print('AVISO', x)
    print(json.dumps(r, ensure_ascii=False))
    sys.exit(1 if f else 0)
