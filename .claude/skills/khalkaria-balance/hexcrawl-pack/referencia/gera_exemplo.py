"""Gera dados/exemplo/: um mundo pequeno (12 x 9) e válido, com tudo o que o formato tem.

É exemplo de FORMATO, não conteúdo de Kharavel: as regiões, a cidade e os eventos são fictícios e marcados com
"exemplo": true. Uso: python referencia/gera_exemplo.py <pasta-do-pack>
"""
import json
import os
import sys
from collections import deque

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hexcrawl_ref import hexmath as hm  # noqa: E402
from hexcrawl_ref import visao  # noqa: E402

PACK = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(PACK, 'dados', 'exemplo')
C, L = 12, 9

mundo_real = json.load(open(os.path.join(PACK, 'dados', 'kharavel', 'mundo', 'mundo.json'), encoding='utf-8'))
mundo = {
    'schemaVersion': 'hexcrawl-mundo/1',
    'exemplo': True,
    'grade': {'orientacao': 'chato', 'offset': 'odd-q', 'colunas': C, 'linhas': L, 'referencia': None},
    'tipos': mundo_real['tipos'],
    'regioes': [
        {'id': 'exemplo-campos', 'nome': 'Campos de Exemplo', 'rank': 1, 'cr': '1', 'hostilidade': 5,
         'cor': '#8c0000', 'tinta': {'cor': '#8c0000', 'forca': 0.18}, 'bioma': 'verde', 'paletaUI': '10',
         'montagem': mundo_real['regioes'][0]['montagem'], 'materiais': []},
        {'id': 'exemplo-serra', 'nome': 'Serra de Exemplo', 'rank': 7, 'cr': '3', 'hostilidade': 15,
         'cor': '#00008d', 'tinta': {'cor': '#00008d', 'forca': 0.18}, 'bioma': 'neve', 'paletaUI': '08',
         'montagem': mundo_real['regioes'][6]['montagem'], 'materiais': []},
    ],
    'cidades': [{'id': 'cidade-exemplo', 'nome': 'Cidade de Exemplo', 'mapaProprio': 'cidades/cidade-exemplo'}],
}

# ---- hexes
mar = {(c, l) for c in (1, 2) for l in range(1, L + 1)}
lago = {(8, 6), (9, 6), (8, 7)}
cidade = {(4, 8), (5, 8)}
montanha = {(11, 1), (12, 1), (11, 2), (12, 2), (11, 3), (12, 3), (11, 4)}
floresta = {(4, 2), (5, 2), (4, 3), (5, 4)}
densa = {(10, 8), (11, 8), (12, 8), (10, 9), (11, 9), (12, 9), (11, 7), (12, 7)}
colinas = {(9, 2), (10, 2), (10, 3), (9, 4), (10, 4), (12, 4), (12, 5)}
pantano = {(7, 6), (7, 7), (9, 7)}
especiais = {
    (4, 4): {'id': 'povoado-exemplo', 'nome': 'Povoado de Exemplo', 'icone': 'povoado-verde',
             'categoria': 'assentamento', 'conflito': False,
             'textoMestre': 'Exemplo de hex especial: vila pré-feita, sem tabela.',
             'textoJogadores': 'Um povoado à beira da estrada.'},
    (10, 5): {'id': 'ruina-exemplo', 'nome': 'Ruína de Exemplo', 'icone': 'ruinas', 'categoria': 'ruina',
              'conflito': True, 'textoMestre': 'Exemplo de masmorra pré-feita (hex de conflito).',
              'textoJogadores': 'Pedras antigas no alto da colina.'},
    (12, 6): {'id': 'marco-exemplo', 'nome': 'Marco de Exemplo', 'icone': 'torre-sombria',
              'categoria': 'marco', 'conflito': False, 'textoMestre': 'Exemplo de marco narrativo.',
              'textoJogadores': 'Uma torre escura domina a serra.'},
}
hexes = []
for c in range(1, C + 1):
    for l in range(1, L + 1):
        hid = hm.id_de(c, l)
        h = {'id': hid, 'tipo': 'campos', 'regiao': None, 'cidade': None, 'custo': None,
             'hostilidade': None, 'variante': (c * 7 + l * 3) % 3, 'especial': None, 'notas': ''}
        if (c, l) in mar:
            h['tipo'] = 'agua'
        elif (c, l) in cidade:
            h['cidade'] = 'cidade-exemplo'
        else:
            h['regiao'] = 'exemplo-campos' if c <= 7 else 'exemplo-serra'
            if (c, l) in lago:
                h['tipo'] = 'agua'
            elif c == 3:
                h['tipo'] = 'litoral'
            elif (c, l) in montanha:
                h['tipo'] = 'montanha'
            elif (c, l) in floresta:
                h['tipo'] = 'floresta'
            elif (c, l) in densa:
                h['tipo'] = 'floresta-densa'
            elif (c, l) in colinas:
                h['tipo'] = 'colinas'
            elif (c, l) in pantano:
                h['tipo'] = 'pantano'
            if (c, l) in especiais:
                h['especial'] = especiais[(c, l)]
        hexes.append(h)
por_id = {h['id']: h for h in hexes}

# ---- rio: caminho mínimo na rede de vértices, do alto da serra até o lago
grafo = {}
for h in hexes:
    for d in hm.CANONICAS:
        k = f'{h["id"]}:{d}'
        a, b = hm.hexes_da_aresta(k)
        if b is None or b not in por_id:
            continue
        v1, v2 = hm.extremos_aresta_px(h['id'], d)
        grafo.setdefault(v1, []).append((v2, k))
        grafo.setdefault(v2, []).append((v1, k))
inicio = hm.extremos_aresta_px('1002', 'N')[0]
alvos = {v for hid in ('0806', '0906', '0807') for d in hm.DIRECOES for v in hm.extremos_aresta_px(hid, d)}
ant = {inicio: None}
fila = deque([inicio])
fim = None
while fila:
    v = fila.popleft()
    if v in alvos:
        fim = v
        break
    for w, k in sorted(grafo.get(v, [])):
        if w not in ant:
            ant[w] = (v, k)
            fila.append(w)
arestas_rio = []
v = fim
while ant[v] is not None:
    v, k = ant[v]
    arestas_rio.append(k)
arestas_rio.reverse()
# o rio não corre pela borda do lago: corta o trecho final que já encosta em água
while arestas_rio and len(arestas_rio) > 1:
    a, b = hm.hexes_da_aresta(arestas_rio[-2])
    if por_id[a]['tipo'] == 'agua' or por_id[b]['tipo'] == 'agua':
        arestas_rio.pop()
    else:
        break
rios = {'schemaVersion': 'hexcrawl-rios/1', 'rios': [{'id': 'rio-exemplo', 'nome': 'Rio de Exemplo', 'tamanho': 'rio',
                                                      'arestas': arestas_rio}]}
set_rio = set(arestas_rio)


# ---- vias: caminho mínimo por hexes de terra
def caminho(a, b, evita=()):
    ant = {a: None}
    fila = deque([a])
    while fila:
        x = fila.popleft()
        if x == b:
            break
        for d, y in sorted(hm.vizinhos(x, C, L).items()):
            if y in ant or por_id[y]['tipo'] == 'agua' or y in evita:
                continue
            ant[y] = x
            fila.append(y)
    out, x = [], b
    while x is not None:
        out.append(x)
        x = ant[x]
    return out[::-1]


estrada = caminho('0404', '1005', evita={'0508', '0408'})
trilha = caminho('1005', '1206')
vias = {'schemaVersion': 'hexcrawl-vias/1', 'vias': [
    {'id': 'estrada-exemplo', 'tipo': 'estrada', 'nome': 'Estrada de Exemplo', 'hexes': estrada},
    {'id': 'trilha-exemplo', 'tipo': 'trilha', 'nome': 'Trilha de Exemplo', 'hexes': trilha}]}

# ---- arestas: pontes onde a estrada cruza o rio; um penhasco na serra
arestas = []
for via in vias['vias']:
    for a, b in zip(via['hexes'], via['hexes'][1:]):
        k = hm.chave_aresta(a, hm.direcao_entre(a, b))
        if k in set_rio and not any(x['aresta'] == k for x in arestas):
            arestas.append({'aresta': k, 'tipo': 'ponte'})
for hid, d in (('1104', 'S'), ('1104', 'SO')):
    k = hm.chave_aresta(hid, d)
    if k not in set_rio:
        arestas.append({'aresta': k, 'tipo': 'penhasco', 'ladoAlto': hid})
arestas_doc = {'schemaVersion': 'hexcrawl-arestas/1', 'arestas': arestas}

territorios = {'schemaVersion': 'hexcrawl-territorios/1', 'territorios': [
    {'id': 'territorio-cidade-exemplo', 'nome': 'Arredores da Cidade de Exemplo', 'cor': '#c9a227',
     'cidade': 'cidade-exemplo', 'hexes': ['0408', '0508', '0407', '0507', '0409', '0509']}]}


# ---- eventos de exemplo
def ev(rid, n, nome, cat, rar, pol, tipos, **extra):
    e = {'id': f'{rid}-{n:02d}', 'nome': nome, 'categoria': cat, 'raridade': rar, 'polaridade': pol,
         'tipos': tipos, 'marca': rar != 'comum' or cat == 'abrigo', 'icone': None,
         'textoMestre': f'Exemplo de {cat} ({rar}).', 'textoJogadores': '', 'mecanica': {},
         'travaNarrativa': False, 'exemplo': True}
    e.update(extra)
    return e


TODOS = ['campos', 'floresta', 'floresta-densa', 'colinas', 'montanha', 'pantano', 'deserto', 'ermo', 'litoral']
eventos = {}
for rid in ('exemplo-campos', 'exemplo-serra'):
    lst = [
        ev(rid, 1, 'Sítio de extração', 'extracao', 'comum', 'favoravel', TODOS, mecanica={'materiais': 'auto'}),
        ev(rid, 2, 'Bando de criaturas', 'combate', 'comum', 'adverso', TODOS, mecanica={'cr': 1, 'criaturas': []}),
        ev(rid, 3, 'Fera solitária', 'combate', 'comum', 'adverso', ['floresta', 'floresta-densa', 'colinas']),
        ev(rid, 4, 'Viajante perdido', 'interacao', 'comum', 'neutro', TODOS, mecanica={'atitude': 'neutra'}),
        ev(rid, 5, 'Patrulha hostil', 'interacao', 'comum', 'adverso', TODOS, mecanica={'atitude': 'hostil'}),
        ev(rid, 6, 'Mascate na estrada', 'comerciante', 'comum', 'favoravel', ['campos', 'litoral', 'colinas'],
           mecanica={'nivel': 1, 'itens': '2d4'}),
        ev(rid, 7, 'Clareira abrigada', 'abrigo', 'comum', 'favoravel', ['floresta', 'colinas', 'campos'],
           icone='abrigo', mecanica={'comodidade': 1}),
        ev(rid, 8, 'Torre afundada', 'ruina', 'notavel', 'neutro', ['pantano', 'litoral', 'campos'],
           icone='ruinas', mecanica={'masmorra': None}),
        ev(rid, 9, 'Aldeia escondida', 'assentamento', 'notavel', 'favoravel', ['floresta', 'campos', 'colinas'],
           icone='povoado-verde', mecanica={'servicos': ['taverna'], 'comerciantes': ['artesao']}),
        ev(rid, 10, 'Covil de bandidos', 'covil', 'notavel', 'adverso', TODOS, icone='torre-sombria',
           mecanica={'faccao': None, 'cr': 2}),
        ev(rid, 11, 'Relíquia esquecida', 'achado', 'raro', 'favoravel', TODOS, icone='ruinas',
           mecanica={'item': None}),
        ev(rid, 12, 'Ninho antigo', 'covil', 'raro', 'adverso', ['montanha', 'colinas', 'floresta-densa'],
           icone='torre-sombria'),
    ]
    eventos[rid] = {'schemaVersion': 'hexcrawl-eventos/1', 'regiao': rid, 'exemplo': True, 'eventos': lst}

consequencias = {}
for rid in eventos:
    consequencias[rid] = {'schemaVersion': 'hexcrawl-consequencias/1', 'regiao': rid, 'exemplo': True,
                          'faixas': [{'de': de, 'ate': ate, 'texto': f'Exemplo: desgaste da faixa {de}-{ate}.'}
                                     for de, ate in ((1, 1), (2, 19), (20, 39), (40, 59), (60, 79), (80, 99), (100, 100))]}

# ---- campanha de exemplo: grupo no povoado, começo do dia 1
tipos = {t['id']: t for t in mundo['tipos']}
pen = {a['aresta']: a['ladoAlto'] for a in arestas if a['tipo'] == 'penhasco'}
vis = visao.visiveis('0404', visao.raio_de_visao(por_id['0404']['tipo'], tipos), C, L, pen)
estado = {
    'schemaVersion': 'hexcrawl-campanha/1', 'exemplo': True, 'semente': 20261023,
    'tempo': {'dia': 1, 'periodo': 'manha'},
    'grupo': {'hex': '0404', 'aresta': None,
              'membros': [{'nome': 'Exemplo A', 'movimento': 9}, {'nome': 'Exemplo B', 'movimento': 10.5}],
              'embarcacao': None},
    'dia': {'orcamento': 9, 'restante': 9, 'divida': 0, 'andados': [], 'explorados': []},
    'vistos': sorted(vis),
    'tabelas': {}, 'definidos': {}, 'revelados': {}, 'consumidos': [], 'extracoesNoDia': 0,
    'diario': [{'dia': 1, 'periodo': 'manha', 'hex': '0404', 'tipo': 'inicio', 'texto': 'O grupo parte do povoado.'}],
}


def grava(rel, doc):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)
        fh.write('\n')


grava('mundo/mundo.json', mundo)
grava('mundo/hexes.json', {'schemaVersion': 'hexcrawl-hexes/1', 'hexes': hexes})
grava('mundo/arestas.json', arestas_doc)
grava('mundo/rios.json', rios)
grava('mundo/vias.json', vias)
grava('mundo/territorios.json', territorios)
for rid, doc in eventos.items():
    grava(f'mundo/eventos/{rid}.json', doc)
for rid, doc in consequencias.items():
    grava(f'mundo/consequencias/{rid}.json', doc)
grava('campanha/estado.json', estado)
print('rio:', arestas_rio)
print('estrada:', estrada, '| trilha:', trilha, '| pontes:', [a['aresta'] for a in arestas if a['tipo'] == 'ponte'])
